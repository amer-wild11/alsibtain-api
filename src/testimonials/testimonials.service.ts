import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Testimonial,
  TestimonialDocument,
} from './schemas/testimonials.schema';
import { PaginationDto } from 'src/common/pagination.dto';
import { CreateTestimonialDto } from './dto/create-testimonia.dto';
import { ImageKitService } from 'src/image-kit/image-kit.service';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectModel(Testimonial.name)
    private readonly testimonialModel: Model<TestimonialDocument>,
    private readonly imagekitService: ImageKitService,
  ) {}
  async getAll(paginationDto?: PaginationDto, search?: string) {
    const { page = 1, limit = 30 } = paginationDto || {};

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    const matchQuery = search
      ? {
          clientType: { $regex: search, $options: 'i' },
        }
      : {};

    const testimonials = await this.testimonialModel
      .aggregate([
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();

    const totalCount = await this.testimonialModel.countDocuments(matchQuery);

    return {
      payload: testimonials,
      message: 'Testimonials retrieved successfully',
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
    };
  }

  async getById(id: string): Promise<TestimonialDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid testimonial id');
    }

    const testimonial = await this.testimonialModel.findById(id).exec();
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    return testimonial;
  }

  async create(data: CreateTestimonialDto, image: Express.Multer.File) {
    if (!image) throw new BadRequestException('Image is required');
    if (!this.imagekitService.isImage(image))
      throw new BadRequestException('Image is not valid.');

    const { url, fileId } = await this.imagekitService.upload(image, {
      folder: 'testimonials/images',
    });

    const testi = await this.testimonialModel.create({
      ...data,
      image: { url, fileId },
    });

    return {
      message: 'Testimonial have been created successfully.',
      testimonial: testi,
    };
  }

  async update(
    id: string,
    data: Partial<CreateTestimonialDto>,
    image?: Express.Multer.File,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid testimonial id');
    }

    const testimonial = await this.testimonialModel.findById(id).exec();
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    let imageData = testimonial.image;

    if (image) {
      if (!this.imagekitService.isImage(image)) {
        throw new BadRequestException('Image is not valid.');
      }
      if (imageData?.fileId) {
        await this.imagekitService.deleteFile(imageData.fileId);
      }
      const { url, fileId } = await this.imagekitService.upload(image, {
        folder: 'testimonials/images',
      });
      imageData = { url, fileId };
    }

    const updatedTestimonial = await this.testimonialModel
      .findByIdAndUpdate(
        id,
        { ...data, image: imageData },
        { new: true, runValidators: true },
      )
      .exec();

    return {
      message: 'Testimonial has been updated successfully.',
      testimonial: updatedTestimonial,
    };
  }

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid testimonial id');
    }

    const testimonial = await this.testimonialModel.findById(id).exec();
    if (!testimonial) {
      throw new NotFoundException('Testimonial not found');
    }

    if (testimonial.image?.fileId) {
      await this.imagekitService.deleteFile(testimonial.image.fileId);
    }

    await this.testimonialModel.findByIdAndDelete(id).exec();

    return { message: 'Testimonial has been deleted successfully.' };
  }
}
