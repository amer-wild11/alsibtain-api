import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async create(data: CreateCategoryDto) {
    const category = await this.categoryModel.create({
      name: data.name,
    });
    return {
      message: 'Category created successfully',
      payload: category,
    };
  }

  async getAll(paginationDto?: PaginationDto, search?: string) {
    const { page = 1, limit = 30 } = paginationDto || {};

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    const matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { 'name.ar': { $regex: search, $options: 'i' } },
        { 'name.en': { $regex: search, $options: 'i' } },
      ];
    }

    const categories = await this.categoryModel.aggregate([
      { $match: matchQuery },
      { $sort: { 'name.en': 1 } }, // Sort by English name
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'category',
          as: 'jobs',
        },
      },
      {
        $addFields: {
          totalJobs: { $size: '$jobs' },
        },
      },
    ]);

    const totalCount = await this.categoryModel.countDocuments(matchQuery);

    return {
      categories,
      totalCategories: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
      message: 'Categories retrieved successfully',
    };
  }

  async getById(id: string) {
    if (id === 'first') {
      const [category] = await this.categoryModel.aggregate([
        { $sort: { 'name.en': 1 } }, // Sort by English name
        { $limit: 1 },
        {
          $lookup: {
            from: 'jobs',
            localField: '_id',
            foreignField: 'category',
            as: 'jobs',
          },
        },
        {
          $addFields: {
            totalJobs: { $size: '$jobs' },
          },
        },
      ]);

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      return category;
    }

    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid category id');
    }

    const [category] = await this.categoryModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'category',
          as: 'jobs',
        },
      },
      {
        $addFields: {
          totalJobs: { $size: '$jobs' },
        },
      },
    ]);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid category id');
    }

    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Build update object - only update fields that are provided
    const updateData: any = {};

    // Update multilingual name field only if provided
    if (data.name) {
      updateData.name = {
        ar: data.name.ar ?? category.name.ar,
        en: data.name.en ?? category.name.en,
      };
    }

    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .exec();

    return {
      message: 'Category updated successfully',
      payload: updatedCategory,
    };
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid category id');
    }
    const category = await this.categoryModel.findByIdAndDelete(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
