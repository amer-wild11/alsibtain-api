import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { isValidObjectId, Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { ImageKitService } from 'src/image-kit/image-kit.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly imageKitService: ImageKitService,
  ) {}

  async getAllProjects(search?: string) {
    const matchQuery: any = {};

    if (search) {
      matchQuery.name = { $regex: search, $options: 'i' };
    }

    const projects = await this.projectModel.find(matchQuery).lean();
    return projects;
  }

  async getProjectById(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid project ID');

    const project = await this.projectModel.findById(id).lean();

    if (!project) throw new BadRequestException('Project not found');

    return project;
  }

  async createProject(
    data: CreateProjectDto,
    logo: Express.Multer.File,
    background: Express.Multer.File,
    thumbnail: Express.Multer.File,
    video: Express.Multer.File,
  ) {
    if (!logo || !background || !thumbnail || !video)
      throw new BadRequestException(
        'All media files are required (logo, background, thumbnail, video)',
      );
    if (!this.imageKitService.isImage(logo))
      throw new BadRequestException('Logo must be an image file');
    if (!this.imageKitService.isImage(background))
      throw new BadRequestException('Background must be an image file');
    if (!this.imageKitService.isImage(thumbnail))
      throw new BadRequestException('Thumbnail must be an image file');
    if (!this.imageKitService.isVideo(video))
      throw new BadRequestException('Video must be a video file');
    if (logo.size > 1000 * 1024)
      throw new BadRequestException('Logo size should be less than 1 Mb');
    if (background.size > 10 * 1024 * 1024)
      throw new BadRequestException('Background size should be less than 10 MB');
    if (thumbnail.size > 10 * 1024 * 1024)
      throw new BadRequestException('Thumbnail size should be less than 10 MB');
    if (video.size > 10 * 1024 * 1024)
      throw new BadRequestException('Video size should be less than 10 MB');
    const logoUpload = await this.imageKitService.upload(logo, {
      folder: '/projects/logos',
      transformation: {
        width: 200,
        quality: 'auto:low',
      },
    });
    const backgroundUpload = await this.imageKitService.upload(background, {
      folder: '/projects/backgrounds',
      transformation: {
        width: 1200,
        quality: 'auto:medium',
      },
    });
    const thumbnailUpload = await this.imageKitService.upload(thumbnail, {
      folder: '/projects/thumbnails',
      transformation: {
        width: 1200,
        quality: 'auto:low',
      },
    });
    const videoUpload = await this.imageKitService.upload(video, {
      folder: '/projects/videos',
      transformation: {
        quality: 'auto:medium',
      },
    });
    const newProject = await this.projectModel.create({
      ...data,
      logo: { fileId: logoUpload.fileId, url: logoUpload.url },
      background: {
        fileId: backgroundUpload.fileId,
        url: backgroundUpload.url,
      },
      introduction: {
        thumbnail: { fileId: thumbnailUpload.fileId, url: thumbnailUpload.url },
        video: { fileId: videoUpload.fileId, url: videoUpload.url },
      },
    });
    return newProject;
  }

  async updateProject(
    id: string,
    data: UpdateProjectDto,
    logo?: Express.Multer.File,
    background?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
    video?: Express.Multer.File,
  ) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid project ID');
    const project = await this.projectModel.findById(id);
    if (!project) throw new BadRequestException('Project not found');

    let updatedData: any = { ...data };
    if (logo) {
      if (!this.imageKitService.isImage(logo))
        throw new BadRequestException('Logo must be an image file');
      if (logo.size > 200 * 1024)
        throw new BadRequestException('Logo size should be less than 200 KB');
      // Delete old logo
      if (project.logo?.fileId) {
        await this.imageKitService.deleteFile(project.logo.fileId);
      }
      const logoUpload = await this.imageKitService.upload(logo, {
        folder: '/projects/logos',
        transformation: {
          width: 200,
          quality: 'auto:low',
        },
      });
      updatedData.logo = { fileId: logoUpload.fileId, url: logoUpload.url };
    }
    if (background) {
      if (!this.imageKitService.isImage(background))
        throw new BadRequestException('Background must be an image file');
      if (background.size > 2 * 1024 * 1024)
        throw new BadRequestException(
          'Background size should be less than 2 MB',
        );
      // Delete old background
      if (project.background?.fileId) {
        await this.imageKitService.deleteFile(project.background.fileId);
      }
      const backgroundUpload = await this.imageKitService.upload(background, {
        folder: '/projects/backgrounds',
        transformation: {
          width: 1200,
          quality: 'auto:medium',
        },
      });
      updatedData.background = {
        fileId: backgroundUpload.fileId,
        url: backgroundUpload.url,
      };
    }
    if (thumbnail) {
      if (!this.imageKitService.isImage(thumbnail))
        throw new BadRequestException('Thumbnail must be an image file');
      if (thumbnail.size > 2 * 1024 * 1024)
        throw new BadRequestException(
          'Thumbnail size should be less than 2 MB',
        );
      // Delete old thumbnail
      if (project.introduction?.thumbnail?.fileId) {
        await this.imageKitService.deleteFile(
          project.introduction.thumbnail.fileId,
        );
      }
      const thumbnailUpload = await this.imageKitService.upload(thumbnail, {
        folder: '/projects/thumbnails',
        transformation: {
          width: 1200,
          quality: 'auto:low',
        },
      });
      if (!updatedData.introduction) {
        updatedData.introduction = {};
      }
      updatedData.introduction.thumbnail = {
        fileId: thumbnailUpload.fileId,
        url: thumbnailUpload.url,
      };
    }
    if (video) {
      if (!this.imageKitService.isVideo(video))
        throw new BadRequestException('Video must be a video file');
      if (video.size > 10 * 1024 * 1024)
        throw new BadRequestException('Video size should be less than 10 MB');
      // Delete old video
      if (project.introduction?.video?.fileId) {
        await this.imageKitService.deleteFile(
          project.introduction.video.fileId,
        );
      }
      const videoUpload = await this.imageKitService.upload(video, {
        folder: '/projects/videos',
        transformation: {
          quality: 'auto:medium',
        },
      });
      if (!updatedData.introduction) {
        updatedData.introduction = {};
      }
      updatedData.introduction.video = {
        fileId: videoUpload.fileId,
        url: videoUpload.url,
      };
    }

    const updatedProject = await this.projectModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true },
    );
    return updatedProject;
  }
  async deleteProject(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid project ID');

    const project = await this.projectModel.findById(id);
    if (!project) throw new BadRequestException('Project not found');
    // Delete associated media files
    if (project.logo?.fileId) {
      await this.imageKitService.deleteFile(project.logo.fileId);
    }
    if (project.background?.fileId) {
      await this.imageKitService.deleteFile(project.background.fileId);
    }
    if (project.introduction?.thumbnail?.fileId) {
      await this.imageKitService.deleteFile(
        project.introduction.thumbnail.fileId,
      );
    }
    if (project.introduction?.video?.fileId) {
      await this.imageKitService.deleteFile(project.introduction.video.fileId);
    }

    await this.projectModel.deleteOne({ _id: id });
    return { message: 'Project deleted successfully' };
  }
}
