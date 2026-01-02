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
  async getAllProjects(@Query('search') search: string) {
    return this.projectsService.getAllProjects(search);
  }

  @Get(':id')
  async getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'background', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async createProject(
    @Body() body: CreateProjectDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      background?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    return this.projectsService.createProject(
      body,
      files.logo?.[0]!,
      files.background?.[0]!,
      files.thumbnail?.[0]!,
      files.video?.[0]!,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'background', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
      { name: 'video', maxCount: 1 },
    ]),
  )
  async updateProject(
    @Param('id') id: string,
    @Body() body: UpdateProjectDto,
    @UploadedFiles()
    files: {
      logo?: Express.Multer.File[];
      background?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    return this.projectsService.updateProject(
      id,
      body,
      files.logo?.[0]!,
      files.background?.[0]!,
      files.thumbnail?.[0]!,
      files.video?.[0]!,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteProject(@Param('id') id: string) {
    return this.projectsService.deleteProject(id);
  }
}
