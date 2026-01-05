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
    @Body() body: any,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    try {
      // Parse JSON strings from FormData
      const data: CreateProjectsUpdatesDto = {
        title: this.parseJSON(body.title, 'title'),
        writtenBy: this.parseJSON(body.writtenBy, 'writtenBy'),
        description: this.parseJSON(body.description, 'description'),
      };

      return this.projectsUpdatesService.create(data, thumbnail);
    } catch (err) {
      throw new BadRequestException(
        'Invalid JSON format for multilingual fields',
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    try {
      // Parse JSON strings from FormData
      const data: UpdateProjectsUpdatesDto = {
        title: body.title ? this.parseJSON(body.title, 'title') : undefined,
        writtenBy: body.writtenBy
          ? this.parseJSON(body.writtenBy, 'writtenBy')
          : undefined,
        description: body.description
          ? this.parseJSON(body.description, 'description')
          : undefined,
      };

      return this.projectsUpdatesService.update(id, data, thumbnail);
    } catch (err) {
      throw new BadRequestException(
        'Invalid JSON format for multilingual fields',
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.projectsUpdatesService.delete(id);
  }

  // Helper method to parse JSON strings
  private parseJSON(value: string, fieldName: string): any {
    if (!value) return undefined;

    try {
      return JSON.parse(value);
    } catch (error) {
      throw new BadRequestException(`Invalid JSON format for ${fieldName}`);
    }
  }
}