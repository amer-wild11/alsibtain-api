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
    return this.latestNewsService.create(data, thumbnail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateLatestNewsDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    return this.latestNewsService.update(id, data, thumbnail);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.latestNewsService.delete(id);
  }
}
