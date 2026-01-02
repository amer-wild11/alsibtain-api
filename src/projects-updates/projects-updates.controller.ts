import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectsUpdatesService } from './projects-updates.service';
import { PaginationDto } from 'src/common/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectsUpdatesDto } from './dto/create-updates.dto';
import { UpdateProjectsUpdatesDto } from './dto/update-projectsUpdates.dto';

@Controller('projects-updates')
export class ProjectsUpdatesController {
  constructor(
    private readonly projectsUpdatesService: ProjectsUpdatesService,
  ) {}

  @Get()
  async getAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.projectsUpdatesService.getAll(paginationDto, search);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.projectsUpdatesService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() data: CreateProjectsUpdatesDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.projectsUpdatesService.create(data, thumbnail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateProjectsUpdatesDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    return this.projectsUpdatesService.update(id, data, thumbnail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.projectsUpdatesService.delete(id);
  }
}
