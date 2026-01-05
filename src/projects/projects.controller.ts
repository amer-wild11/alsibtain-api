import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  getAllProjects(@Query('search') search?: string) {
    return this.projectsService.getAllProjects(search);
  }

  @Get(':id')
  getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  // ✅ CREATE
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'background', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'imageGallery', maxCount: 20 },
      { name: 'videoGallery', maxCount: 10 },
    ]),
  )
  createProject(
    @Body() body: CreateProjectDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      background?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
      imageGallery?: Express.Multer.File[];
      videoGallery?: Express.Multer.File[];
    },
  ) {
    return this.projectsService.createProject(body, files);
  }

  // ✅ UPDATE
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'background', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'imageGallery', maxCount: 20 },
      { name: 'videoGallery', maxCount: 10 },
    ]),
  )
  updateProject(
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      background?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
      imageGallery?: Express.Multer.File[];
      videoGallery?: Express.Multer.File[];
    },
  ) {
    return this.projectsService.updateProject(id, body, files);
  }

  // ✅ REMOVE SINGLE GALLERY ITEM
  @Delete(':id/gallery/:galleryType/:fileId')
  @UseGuards(AuthGuard('jwt'))
  removeGalleryItem(
    @Param('id') projectId: string,
    @Param('galleryType') galleryType: 'imageGallery' | 'videoGallery',
    @Param('fileId') fileId: string,
  ) {
    return this.projectsService.removeGalleryItem(
      projectId,
      galleryType,
      fileId,
    );
  }

  // ✅ DELETE PROJECT
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }
}
