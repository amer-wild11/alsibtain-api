import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImageKitService } from 'src/image-kit/image-kit.service';
import { Video } from './schemas/video.schema';

@Injectable()
export class VideoService {
  constructor(
    @InjectModel('Video') private videoModel: Model<Video>,
    private readonly imagekitService: ImageKitService,
  ) {}

  async getAll() {
    return this.videoModel.find().lean();
  }

  async create(video: Express.Multer.File) {
    if (!video) {
      throw new BadRequestException('Video is required');
    }

    const MAX_SIZE = 30 * 1024 * 1024;

    if (video.size > MAX_SIZE) {
      throw new BadRequestException('Video size must not exceed 10MB');
    }
    if (!video.mimetype.startsWith('video/')) {
      throw new BadRequestException('Only video files are allowed');
    }

    const { url, fileId } = await this.imagekitService.upload(video, {
      folder: 'gallery/videos',
      transformation: { width: 1280 },
    });

    const res = await this.videoModel.create({
      url,
      fileId,
    });

    return {
      message: 'Video added successfully',
      video: res,
    };
  }

  async delete(id: string) {
    if (!id) throw new BadRequestException('Video id is required');

    const video = await this.videoModel.findById(id);
    if (!video) throw new NotFoundException('Video not found');

    if (video.fileId) {
      await this.imagekitService.deleteFile(video.fileId);
    }

    await video.deleteOne();

    return { message: 'Video deleted successfully' };
  }
}
