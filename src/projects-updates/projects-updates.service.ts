import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Updates, UpdatesDocument } from './schemas/updates.schema';
import { PaginationDto } from 'src/common/pagination.dto';
import { ImageKitService } from 'src/image-kit/image-kit.service';
import { UpdateProjectsUpdatesDto } from './dto/update-projectsUpdates.dto';
import { CreateProjectsUpdatesDto } from './dto/create-updates.dto';

@Injectable()
export class ProjectsUpdatesService {
  constructor(
    @InjectModel(Updates.name)
    private readonly updatesModel: Model<UpdatesDocument>,
    private readonly imagekitService: ImageKitService,
  ) {}

  async getAll(paginationDto?: PaginationDto, search?: string) {
    const { page = 1, limit = 30 } = paginationDto || {};

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    // Search supports either ar or en title
    const matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { 'title.ar': { $regex: search, $options: 'i' } },
        { 'title.en': { $regex: search, $options: 'i' } },
      ];
    }

    const updates = await this.updatesModel
      .aggregate([
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();

    const totalCount = await this.updatesModel.countDocuments(matchQuery);

    return {
      payload: updates,
      message: 'Project updates retrieved successfully',
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
    };
  }

  async getById(id: string) {
    if (id == 'first') {
      const updates = await this.updatesModel.find().limit(1);
      if (!updates) throw new NotFoundException('No updates found');
      return updates[0];
    }
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid update id');

    const update = await this.updatesModel.findById(id).exec();
    if (!update) throw new NotFoundException('Update not found');

    return update;
  }

  async create(data: CreateProjectsUpdatesDto, thumbnail: Express.Multer.File) {
    if (!thumbnail) throw new BadRequestException('Thumbnail is required');
    if (!this.imagekitService.isImage(thumbnail))
      throw new BadRequestException('Thumbnail is not valid.');

    const { url, fileId } = await this.imagekitService.upload(thumbnail, {
      folder: 'projects-updates/images',
    });

    const updateItem = await this.updatesModel.create({
      title: data.title,
      writtenBy: data.writtenBy,
      description: data.description,
      thumbnail: { url, fileId },
    });

    return {
      message: 'Project update created successfully',
      update: updateItem,
    };
  }

  async update(
    id: string,
    data: UpdateProjectsUpdatesDto,
    thumbnail?: Express.Multer.File,
  ) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid update id');

    const update = await this.updatesModel.findById(id).exec();
    if (!update) throw new NotFoundException('Update not found');

    let thumbnailData = update.thumbnail;

    if (thumbnail) {
      if (!this.imagekitService.isImage(thumbnail))
        throw new BadRequestException('Thumbnail is not valid.');
      if (thumbnailData?.fileId)
        await this.imagekitService.deleteFile(thumbnailData.fileId);

      const { url, fileId } = await this.imagekitService.upload(thumbnail, {
        folder: 'projects-updates/images',
      });
      thumbnailData = { url, fileId };
    }

    // Build update object - only update fields that are provided
    const updateData: any = {
      thumbnail: thumbnailData,
    };

    // Update multilingual fields only if provided
    if (data.title) {
      updateData.title = {
        ar: data.title.ar ?? update.title.ar,
        en: data.title.en ?? update.title.en,
      };
    }

    if (data.writtenBy) {
      updateData.writtenBy = {
        ar: data.writtenBy.ar ?? update.writtenBy.ar,
        en: data.writtenBy.en ?? update.writtenBy.en,
      };
    }

    if (data.description) {
      updateData.description = {
        ar: data.description.ar ?? update.description.ar,
        en: data.description.en ?? update.description.en,
      };
    }

    const updatedUpdate = await this.updatesModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    return {
      message: 'Project update updated successfully',
      update: updatedUpdate,
    };
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid update id');

    const update = await this.updatesModel.findById(id).exec();
    if (!update) throw new NotFoundException('Update not found');

    if (update.thumbnail?.fileId)
      await this.imagekitService.deleteFile(update.thumbnail.fileId);

    await this.updatesModel.findByIdAndDelete(id).exec();

    return { message: 'Project update deleted successfully' };
  }
}
