import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Get()
  getAll() {
    return this.galleryService.getAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard('jwt'))
  create(@UploadedFile() image: Express.Multer.File) {
    return this.galleryService.create(image);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.galleryService.delete(id);
  }
}
