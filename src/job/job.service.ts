import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Job, JobDocument } from './schemas/job.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { Category } from 'src/category/schemas/category.schema';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<JobDocument>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async createJob(createJobDto: CreateJobDto) {
    if (!isValidObjectId(createJobDto.category))
      throw new BadRequestException('Job category id is not valid');
    const category = await this.categoryModel.findById(createJobDto.category);
    if (!category) throw new NotFoundException('Category is not found');
    const job = await this.jobModel.create({
      ...createJobDto,
      category: new Types.ObjectId(createJobDto.category),
      applications: [],
    });

    return {
      message: 'Job created successfully',
      payload: job,
    };
  }

  async getAllJobs(
    paginationDto?: PaginationDto,
    search?: string,
    categoryIds?: string[],
  ) {
    const { page = 1, limit = 30 } = paginationDto || {};
    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }
    const skip = (page - 1) * limit;

    const matchQuery: any = {};
    if (search) matchQuery.title = { $regex: search, $options: 'i' };
    if (categoryIds?.length)
      matchQuery.category = {
        $in: categoryIds.map((id) => new Types.ObjectId(id)),
      };

    const jobs = await this.jobModel.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job',
          as: 'applications',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    ]);

    const totalCount = await this.jobModel.countDocuments(matchQuery);

    return {
      payload: jobs,
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
      message: 'Jobs retrieved successfully',
    };
  }

  async getJobById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job id');
    }

    const job = await this.jobModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'applications',
          localField: '_id',
          foreignField: 'job',
          as: 'applications',
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
    ]);

    if (!job.length) {
      throw new NotFoundException('Job not found');
    }

    return job[0];
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job id');
    }

    const updateData: any = { ...updateJobDto };

    if (updateData.category) {
      updateData.category = new Types.ObjectId(updateData.category);
    }

    const job = await this.jobModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      message: 'Job updated successfully',
      payload: job,
    };
  }

  async deleteJob(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid job id');
    }

    const job = await this.jobModel.findByIdAndDelete(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return {
      message: 'Job deleted successfully',
    };
  }
}
