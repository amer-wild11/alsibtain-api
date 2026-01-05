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
import { LatestNewsService } from './latest-news.service';
import { PaginationDto } from 'src/common/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateLatestNewsDto } from './dto/update-news.dto';
import { CreateLatestNewsDto } from './dto/create-news.dto';

@Controller('latest-news')
export class LatestNewsController {
  constructor(private readonly latestNewsService: LatestNewsService) {}

  @Get()
  async getAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.latestNewsService.getAll(paginationDto, search);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.latestNewsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() data: CreateLatestNewsDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    // Parse multilingual fields from string to object if needed
    try {
      const title =
        typeof data.title === 'string' ? JSON.parse(data.title) : data.title;
      const writtenBy =
        typeof data.writtenBy === 'string'
          ? JSON.parse(data.writtenBy)
          : data.writtenBy;
      const caption =
        typeof data.caption === 'string'
          ? JSON.parse(data.caption)
          : data.caption;
      const category =
        typeof data.category === 'string'
          ? JSON.parse(data.category)
          : data.category;

      return this.latestNewsService.create(
        { ...data, title, writtenBy, caption, category },
        thumbnail,
      );
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
    @Body() data: UpdateLatestNewsDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    try {
      const title =
        data.title && typeof data.title === 'string'
          ? JSON.parse(data.title)
          : data.title;
      const writtenBy =
        data.writtenBy && typeof data.writtenBy === 'string'
          ? JSON.parse(data.writtenBy)
          : data.writtenBy;
      const caption =
        data.caption && typeof data.caption === 'string'
          ? JSON.parse(data.caption)
          : data.caption;
      const category =
        data.category && typeof data.category === 'string'
          ? JSON.parse(data.category)
          : data.category;

      return this.latestNewsService.update(
        id,
        { ...data, title, writtenBy, caption, category },
        thumbnail,
      );
    } catch (err) {
      throw new BadRequestException(
        'Invalid JSON format for multilingual fields',
      );
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.latestNewsService.delete(id);
  }
}
