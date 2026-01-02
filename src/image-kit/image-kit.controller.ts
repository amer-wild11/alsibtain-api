import {
  Controller,
  Delete,
  InternalServerErrorException,
  Query,
  UseGuards,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageKitService } from './image-kit.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('files')
export class UploadController {
  constructor(private readonly imageKit: ImageKitService) {}

  @Post('upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    if (!file) {
      throw new InternalServerErrorException('File is required');
    }

    try {
      return await this.imageKit.upload(file, {
        folder,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Query('fileId') fileId: string) {
    try {
      await this.imageKit.deleteFile(fileId);
      return { message: 'File deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
