import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { LatestNews, LatestNewsDocument } from './schemas/latest-news.schema';
import { PaginationDto } from 'src/common/pagination.dto';
import { CreateLatestNewsDto } from './dto/create-news.dto';
import { UpdateLatestNewsDto } from './dto/update-news.dto';
import { ImageKitService } from 'src/image-kit/image-kit.service';

@Injectable()
export class LatestNewsService {
  constructor(
    @InjectModel(LatestNews.name)
    private readonly newsModel: Model<LatestNewsDocument>,
    private readonly imagekitService: ImageKitService,
  ) {}

  // Get all news with pagination (simple search by any lang title)
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

    const news = await this.newsModel
      .aggregate([
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();

    const totalCount = await this.newsModel.countDocuments(matchQuery);

    return {
      payload: news,
      message: 'Latest news retrieved successfully',
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
    };
  }

  // Get by ID or first
  async getById(id: string) {
    if (id === 'first') {
      const news = await this.newsModel.find().limit(1);
      if (!news.length) throw new NotFoundException('No news found');
      return news[0];
    }

    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid news id');

    const news = await this.newsModel.findById(id).exec();
    if (!news) throw new NotFoundException('News not found');

    return news;
  }

  // Create news with multilingual fields
  async create(data: CreateLatestNewsDto, image: Express.Multer.File) {
    if (!image) throw new BadRequestException('Thumbnail is required');
    if (!this.imagekitService.isImage(image))
      throw new BadRequestException('Thumbnail is not valid.');

    const { url, fileId } = await this.imagekitService.upload(image, {
      folder: 'latest-news/thumbnails',
    });

    const newsItem = await this.newsModel.create({
      title: data.title,
      writtenBy: data.writtenBy,
      caption: data.caption,
      category: data.category,
      thumbnail: { url, fileId },
    });

    return { message: 'News created successfully', news: newsItem };
  }

  // Update news with multilingual fields
  async update(
    id: string,
    data: UpdateLatestNewsDto,
    image?: Express.Multer.File,
  ) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid news id');

    const news = await this.newsModel.findById(id).exec();
    if (!news) throw new NotFoundException('News not found');

    let thumbnailData = news.thumbnail;

    if (image) {
      if (!this.imagekitService.isImage(image))
        throw new BadRequestException('Image is not valid.');

      if (thumbnailData?.fileId)
        await this.imagekitService.deleteFile(thumbnailData.fileId);

      const { url, fileId } = await this.imagekitService.upload(image, {
        folder: 'latest-news/thumbnails',
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
        ar: data.title.ar ?? news.title.ar,
        en: data.title.en ?? news.title.en,
      };
    }

    if (data.writtenBy) {
      updateData.writtenBy = {
        ar: data.writtenBy.ar ?? news.writtenBy.ar,
        en: data.writtenBy.en ?? news.writtenBy.en,
      };
    }

    if (data.caption) {
      updateData.caption = {
        ar: data.caption.ar ?? news.caption.ar,
        en: data.caption.en ?? news.caption.en,
      };
    }

    if (data.category) {
      updateData.category = {
        ar: data.category.ar ?? news.category.ar,
        en: data.category.en ?? news.category.en,
      };
    }

    const updatedNews = await this.newsModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    return { message: 'Latest news updated successfully', news: updatedNews };
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid news id');

    const news = await this.newsModel.findById(id).exec();
    if (!news) throw new NotFoundException('News not found');

    if (news.thumbnail?.fileId)
      await this.imagekitService.deleteFile(news.thumbnail.fileId);

    await this.newsModel.findByIdAndDelete(id).exec();

    return { message: 'Latest news deleted successfully' };
  }
}
