// pages.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page } from './schema/page.schema';
import { mergeContent } from 'utils/mergeContent';
import { UpdatePageDto } from './dtos/update-page.dto';
import { pagesContent } from 'content/page-content';

@Injectable()
export class PagesService implements OnModuleInit {
  constructor(@InjectModel(Page.name) private pageModel: Model<Page>) {}

  async onModuleInit() {
    await this.syncPages();
  }

  async syncPages() {
    for (const defaultPage of pagesContent) {
      const existing = await this.pageModel.findOne({ name: defaultPage.name });

      if (!existing) {
        await this.pageModel.create(defaultPage);
      } else {
        const merged = mergeContent(defaultPage, existing.toObject());

        if (JSON.stringify(merged) !== JSON.stringify(existing.toObject())) {
          await this.pageModel.updateOne(
            { _id: existing._id },
            { $set: merged },
          );
        }
      }
    }
  }

  async getPageContent(pageName?: string, fields?: string) {
    const query: any = {};
    if (pageName) query.name = pageName;

    let projection: any = {};
    if (fields) {
      fields.split(',').forEach((field) => {
        projection[field.trim()] = 1;
      });
    } else {
      projection = undefined;
    }

    const page = await this.pageModel.findOne(query, projection).lean();
    if (!page) throw new NotFoundException('Page not found');

    return page;
  }

  async updateContent(dto: UpdatePageDto) {
    const { pageName, sectionName, contentName, value } = dto;

    const page = await this.pageModel.findOne({ name: pageName });
    if (!page) {
      throw new NotFoundException(`Page "${pageName}" not found`);
    }

    if (!(sectionName in page.sections)) {
      throw new NotFoundException(
        `Section "${sectionName}" not found in page "${pageName}"`,
      );
    }

    let path: string;
    let updateDoc: Record<string, any>;

    if (contentName) {
      if (!(contentName in page.sections[sectionName])) {
        throw new NotFoundException(
          `Content "${contentName}" not found in section "${sectionName}" of page "${pageName}"`,
        );
      }

      const currentContent = page.sections[sectionName][contentName];

      if (
        currentContent &&
        typeof currentContent === 'object' &&
        'value' in currentContent
      ) {
        path = `sections.${sectionName}.${contentName}.value`;
        const currentValue =
          currentContent.value?.toObject?.() ?? currentContent.value;

        updateDoc = {
          [path]: this.deepMerge(currentValue, value),
        };
      } else {
        path = `sections.${sectionName}.${contentName}`;
        const currentValue = currentContent?.toObject?.() ?? currentContent;

        updateDoc = {
          [path]:
            typeof value === 'object' && value !== null
              ? this.deepMerge(currentValue, value)
              : value,
        };
      }
    } else {
      path = `sections.${sectionName}`;
      const currentSection =
        page.sections[sectionName].toObject?.() ?? page.sections[sectionName];

      updateDoc = {
        [path]: this.deepMerge(currentSection, value),
      };
    }

    const result = await this.pageModel.updateOne(
      { _id: page._id },
      { $set: updateDoc },
    );

    if (result.modifiedCount === 0) {
      throw new BadRequestException('No changes applied');
    }

    const updatedPage = await this.pageModel.findById(page._id).lean();
    if (!updatedPage) {
      throw new NotFoundException(`Page "${pageName}" not found after update`);
    }

    const updatedValue = contentName
      ? updatedPage.sections?.[sectionName]?.[contentName]
      : updatedPage.sections?.[sectionName];

    return {
      success: true,
      path,
      value: updatedValue,
      message: 'Section updated successfully.',
    };
  }

  private deepMerge(target: any, source: any): any {
    if (typeof target !== 'object' || target === null) {
      return source;
    }

    if (typeof source !== 'object' || source === null) {
      return source;
    }

    if (Array.isArray(source)) {
      return source;
    }

    const result = { ...target };

    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key])
        ) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }

    return result;
  }
}
