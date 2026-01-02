import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ProjectSlider } from './schemas/project-slider.schema';
import { ImageKitService } from 'src/image-kit/image-kit.service';
import { CreateProjectSliderDto } from './dto/create-project-slider.dto';
import { UpdateProjectDto } from 'src/projects/dto/update-project.dto';

@Injectable()
export class ProjectSliderService {
  constructor(
    @InjectModel(ProjectSlider.name)
    private readonly ProjectSliderModel: Model<ProjectSlider>,
    private readonly ImagekitService: ImageKitService,
  ) {}

  async getAll(search?: string) {
    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { area: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const projects = await this.ProjectSliderModel.find(query).lean();
    return { projects };
  }

  async getOne(id: string, search?: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Project id is not valid');

    let query: any = { _id: id };

    if (search) {
      query = {
        _id: id,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { area: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const project = await this.ProjectSliderModel.findOne(query).lean();

    if (!project) throw new NotFoundException('Project is not found');

    return { project };
  }
  async create(data: CreateProjectSliderDto, video: Express.Multer.File) {
    if (!video) throw new BadRequestException('Project video is required!');
    if (!this.ImagekitService.isVideo(video))
      throw new BadRequestException('Video is not valid video file');
    const MAX_SIZE = 10 * 1024 * 1024;

    if (video.size > MAX_SIZE) {
      throw new BadRequestException('Video size must not exceed 10MB');
    }

    const { url, fileId } = await this.ImagekitService.upload(video, {
      folder: '/projects-slider/videos',
    });
    const project = await this.ProjectSliderModel.create({
      ...data,
      video: { url, fileId },
    });
    return { message: 'Project have been created successfully.', project };
  }

  async update(
    id: string,
    data: UpdateProjectDto,
    video?: Express.Multer.File,
  ) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Project id is not valid.');
    let dataToUpdate: any = { ...data };
    const project = await this.ProjectSliderModel.findById(id);
    if (!project) throw new NotFoundException('Project is not found');
    if (video) {
      await this.ImagekitService.deleteFile(project?.video?.fileId);
      const { url, fileId } = await this.ImagekitService.upload(video, {
        folder: '/projects-slider/videos',
      });
      dataToUpdate.video = { url, fileId };
    }
    const updatedProject = await this.ProjectSliderModel.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true },
    );

    return {
      message: 'Project updated successfully.',
      project: updatedProject,
    };
  }

  async delete(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Project id is not valid');
    const project = await this.ProjectSliderModel.findById(id);
    if (!project) throw new NotFoundException('Project is not found');
    if (project.video) {
      await this.ImagekitService.deleteFile(project.video.fileId);
    }
    const res = await this.ProjectSliderModel.findByIdAndDelete(id);
    return {
      message: 'Project have been deleted successfully',
      res,
    };
  }
}
