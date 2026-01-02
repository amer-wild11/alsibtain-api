import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImageKitService } from 'src/image-kit/image-kit.service';
import { Gallery } from './schemas/gallery.schema';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel('Gallery') private galleryModel: Model<Gallery>,
    private readonly imagekitService: ImageKitService,
  ) {}

  async getAll() {
    return this.galleryModel.find().lean();
  }

  async create(image: Express.Multer.File) {
    if (!image) throw new BadRequestException('Image is required');

    const { url, fileId } = await this.imagekitService.upload(image, {
      folder: 'gallery',
    });

    const res = await this.galleryModel.create({ url, fileId });

    return { message: 'Image added', image: res };
  }

  async delete(id: string) {
    if (!id) throw new BadRequestException('Image id is required');

    const image = await this.galleryModel.findById(id);
    if (!image) throw new NotFoundException('Image not found');

    if (image.fileId) {
      await this.imagekitService.deleteFile(image.fileId);
    }

    await image.deleteOne();

    return { message: 'Image deleted successfully' };
  }
}
