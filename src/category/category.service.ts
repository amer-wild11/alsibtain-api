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
    const category = await this.categoryModel.create(data);
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
      matchQuery.name = { $regex: search, $options: 'i' };
    }

    const categories = await this.categoryModel.aggregate([
      { $match: matchQuery },
      { $sort: { name: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: 'category',
          as: 'jobs', // full jobs array
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
        { $sort: { name: 1 } },
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
    const category = await this.categoryModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return {
      message: 'Category updated successfully',
      payload: category,
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
