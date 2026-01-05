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
      // Search in both AR and EN name fields
      matchQuery.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } },
      ];
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
    files: {
      logo?: Express.Multer.File[];
      background?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
      imageGallery?: Express.Multer.File[];
      videoGallery?: Express.Multer.File[];
    },
  ) {
    const logo = files.logo?.[0];
    const background = files.background?.[0];
    const thumbnail = files.thumbnail?.[0];
    const video = files.video?.[0];

    // Validate required files
    if (!logo || !background || !thumbnail || !video)
      throw new BadRequestException(
        'All media files are required (logo, background, thumbnail, video)',
      );

    // Validate file types and sizes
    if (!this.imageKitService.isImage(logo))
      throw new BadRequestException('Logo must be an image file');
    if (!this.imageKitService.isImage(background))
      throw new BadRequestException('Background must be an image file');
    if (!this.imageKitService.isImage(thumbnail))
      throw new BadRequestException('Thumbnail must be an image file');
    if (!this.imageKitService.isVideo(video))
      throw new BadRequestException('Video must be a video file');

    if (logo.size > 1000 * 1024)
      throw new BadRequestException('Logo size should be less than 1 MB');
    if (background.size > 10 * 1024 * 1024)
      throw new BadRequestException('Background size should be less than 10 MB');
    if (thumbnail.size > 10 * 1024 * 1024)
      throw new BadRequestException('Thumbnail size should be less than 10 MB');
    if (video.size > 10 * 1024 * 1024)
      throw new BadRequestException('Video size should be less than 10 MB');

    // Upload required files
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

    // Upload image gallery
    const imageGallery: Array<{ fileId: string; url: string }> = [];
    if (files.imageGallery && files.imageGallery.length > 0) {
      for (const image of files.imageGallery) {
        if (!this.imageKitService.isImage(image))
          throw new BadRequestException('All gallery items must be images');
        if (image.size > 10 * 1024 * 1024)
          throw new BadRequestException('Gallery image size should be less than 10 MB');

        const upload = await this.imageKitService.upload(image, {
          folder: '/projects/image-gallery',
          transformation: {
            width: 1200,
            quality: 'auto:medium',
          },
        });
        imageGallery.push({ fileId: upload.fileId, url: upload.url });
      }
    }

    // Upload video gallery
    const videoGallery: Array<{ fileId: string; url: string }> = [];
    if (files.videoGallery && files.videoGallery.length > 0) {
      for (const videoFile of files.videoGallery) {
        if (!this.imageKitService.isVideo(videoFile))
          throw new BadRequestException('All gallery items must be videos');
        if (videoFile.size > 50 * 1024 * 1024)
          throw new BadRequestException('Gallery video size should be less than 50 MB');

        const upload = await this.imageKitService.upload(videoFile, {
          folder: '/projects/video-gallery',
          transformation: {
            quality: 'auto:medium',
          },
        });
        videoGallery.push({ fileId: upload.fileId, url: upload.url });
      }
    }

    // Create project with all data
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
      imageGallery,
      videoGallery,
    });

    return newProject;
  }

  async updateProject(
    id: string,
    data: UpdateProjectDto,
    files: {
      logo?: Express.Multer.File[];
      background?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
      imageGallery?: Express.Multer.File[];
      videoGallery?: Express.Multer.File[];
    },
  ) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Invalid project ID');

    const project = await this.projectModel.findById(id);
    if (!project) throw new BadRequestException('Project not found');

    let updatedData: any = { ...data };

    // Handle logo update
    if (files.logo?.[0]) {
      const logo = files.logo[0];
      if (!this.imageKitService.isImage(logo))
        throw new BadRequestException('Logo must be an image file');
      if (logo.size > 1000 * 1024)
        throw new BadRequestException('Logo size should be less than 1 MB');

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

    // Handle background update
    if (files.background?.[0]) {
      const background = files.background[0];
      if (!this.imageKitService.isImage(background))
        throw new BadRequestException('Background must be an image file');
      if (background.size > 10 * 1024 * 1024)
        throw new BadRequestException('Background size should be less than 10 MB');

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

    // Handle thumbnail update
    if (files.thumbnail?.[0]) {
      const thumbnail = files.thumbnail[0];
      if (!this.imageKitService.isImage(thumbnail))
        throw new BadRequestException('Thumbnail must be an image file');
      if (thumbnail.size > 10 * 1024 * 1024)
        throw new BadRequestException('Thumbnail size should be less than 10 MB');

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
        updatedData.introduction = { ...project.introduction };
      }
      updatedData.introduction.thumbnail = {
        fileId: thumbnailUpload.fileId,
        url: thumbnailUpload.url,
      };
    }

    // Handle video update
    if (files.video?.[0]) {
      const video = files.video[0];
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
        updatedData.introduction = { ...project.introduction };
      }
      updatedData.introduction.video = {
        fileId: videoUpload.fileId,
        url: videoUpload.url,
      };
    }

    // Handle image gallery update (append new images)
    if (files.imageGallery && files.imageGallery.length > 0) {
      const newImages: Array<{ fileId: string; url: string }> = [];
      for (const image of files.imageGallery) {
        if (!this.imageKitService.isImage(image))
          throw new BadRequestException('All gallery items must be images');
        if (image.size > 10 * 1024 * 1024)
          throw new BadRequestException('Gallery image size should be less than 10 MB');

        const upload = await this.imageKitService.upload(image, {
          folder: '/projects/image-gallery',
          transformation: {
            width: 1200,
            quality: 'auto:medium',
          },
        });
        newImages.push({ fileId: upload.fileId, url: upload.url });
      }

      // Append to existing gallery
      updatedData.imageGallery = [
        ...(project.imageGallery || []),
        ...newImages,
      ];
    }

    // Handle video gallery update (append new videos)
    if (files.videoGallery && files.videoGallery.length > 0) {
      const newVideos: Array<{ fileId: string; url: string }> = [];
      for (const videoFile of files.videoGallery) {
        if (!this.imageKitService.isVideo(videoFile))
          throw new BadRequestException('All gallery items must be videos');
        if (videoFile.size > 50 * 1024 * 1024)
          throw new BadRequestException('Gallery video size should be less than 50 MB');

        const upload = await this.imageKitService.upload(videoFile, {
          folder: '/projects/video-gallery',
          transformation: {
            quality: 'auto:medium',
          },
        });
        newVideos.push({ fileId: upload.fileId, url: upload.url });
      }

      // Append to existing gallery
      updatedData.videoGallery = [
        ...(project.videoGallery || []),
        ...newVideos,
      ];
    }

    const updatedProject = await this.projectModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true },
    );

    return updatedProject;
  }

  // New method to remove gallery items
  async removeGalleryItem(
    projectId: string,
    galleryType: 'imageGallery' | 'videoGallery',
    fileId: string,
  ) {
    if (!isValidObjectId(projectId))
      throw new BadRequestException('Invalid project ID');

    const project = await this.projectModel.findById(projectId);
    if (!project) throw new BadRequestException('Project not found');

    // Find and delete the file
    const gallery = project[galleryType] || [];
    const fileIndex = gallery.findIndex((item) => item.fileId === fileId);

    if (fileIndex === -1)
      throw new BadRequestException('Gallery item not found');

    // Delete from ImageKit
    await this.imageKitService.deleteFile(fileId);

    // Remove from array
    gallery.splice(fileIndex, 1);

    // Update project
    await this.projectModel.findByIdAndUpdate(projectId, {
      [galleryType]: gallery,
    });

    return { message: 'Gallery item removed successfully' };
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

    // Delete image gallery
    if (project.imageGallery && project.imageGallery.length > 0) {
      for (const image of project.imageGallery) {
        if (image.fileId) {
          await this.imageKitService.deleteFile(image.fileId);
        }
      }
    }

    // Delete video gallery
    if (project.videoGallery && project.videoGallery.length > 0) {
      for (const video of project.videoGallery) {
        if (video.fileId) {
          await this.imageKitService.deleteFile(video.fileId);
        }
      }
    }

    await this.projectModel.deleteOne({ _id: id });
    return { message: 'Project deleted successfully' };
  }
}