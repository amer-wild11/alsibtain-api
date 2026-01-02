import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { PaginationDto } from 'src/common/pagination.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ImageKitService } from 'src/image-kit/image-kit.service';
import { Multer } from 'multer';
import { Job } from 'src/job/schemas/job.schema';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
    @InjectModel(Job.name)
    private readonly jobsModel: Model<Job>,
    private readonly imagekitService: ImageKitService,
  ) {}

  async create(
    dto: CreateApplicationDto,
    cv: Express.Multer.File,
    coverLetter: Express.Multer.File,
  ) {
    if (!isValidObjectId(dto.job))
      throw new BadRequestException('Job id is not valid');
    const job = await this.jobsModel.findById(dto.job);
    if (!job)
      throw new NotFoundException(
        'Job not found. Please apply to an existing job.',
      );
    if (
      !this.imagekitService.isPdf(cv) ||
      !this.imagekitService.isPdf(coverLetter)
    )
      throw new BadRequestException(
        'CV and Cover letter have to be pdf files.',
      );

    const { url, fileId } = await this.imagekitService.upload(cv, {
      folder: 'applications/cvs',
    });

    const { url: coverLetterUrl, fileId: coverLetterFileId } =
      await this.imagekitService.upload(coverLetter, {
        folder: 'applications/coverLetters',
      });

    const application = await this.applicationModel.create({
      ...dto,
      cv: { url, fileId },
      coverLetter: { url: coverLetterUrl, fileId: coverLetterFileId },
      job: new Types.ObjectId(dto.job),
    });
    return {
      message:
        'Thanks for applying for this job, the team will contact you ass soon as possible.',
      payload: application,
    };
  }

  async getAll(paginationDto?: PaginationDto, search?: string) {
    const { page = 1, limit = 30 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const matchQuery: any = {};
    if (search) {
      matchQuery.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const applications = await this.applicationModel
      .find(matchQuery)
      .populate('job')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.applicationModel.countDocuments(matchQuery);

    return {
      payload: applications,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid application id');
    }

    const application = await this.applicationModel
      .findById(id)
      .populate('job'); // Populate the job reference

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }
  async update(
    id: string,
    dto: UpdateApplicationDto,
    cv?: Express.Multer.File,
    coverLetter?: Express.Multer.File,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid application id');
    }

    const application = await this.applicationModel.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const updateData: any = { ...dto };

    if (cv) {
      if (!this.imagekitService.isPdf(cv)) {
        throw new BadRequestException('CV has to be a pdf file.');
      }

      if (application.cv?.fileId) {
        await this.imagekitService.deleteFile(application.cv.fileId);
      }

      const { url, fileId } = await this.imagekitService.upload(cv, {
        folder: 'applications/cvs',
      });
      updateData.cv = { url, fileId };
    }

    if (coverLetter) {
      if (!this.imagekitService.isPdf(coverLetter)) {
        throw new BadRequestException('Cover letter has to be a pdf file.');
      }

      if (application.coverLetter?.fileId) {
        await this.imagekitService.deleteFile(application.coverLetter.fileId);
      }

      const { url: coverLetterUrl, fileId: coverLetterFileId } =
        await this.imagekitService.upload(coverLetter, {
          folder: 'applications/coverLetters',
        });
      updateData.coverLetter = {
        url: coverLetterUrl,
        fileId: coverLetterFileId,
      };
    }

    const updatedApplication = await this.applicationModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    return {
      message: 'Application updated successfully',
      payload: updatedApplication,
    };
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid application id');
    }

    const application = await this.applicationModel.findByIdAndDelete(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return { message: 'Application deleted successfully' };
  }
}
