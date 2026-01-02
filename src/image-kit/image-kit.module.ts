import { Module } from '@nestjs/common';
import { ImageKitService } from './image-kit.service';
import { UploadController } from './image-kit.controller';

@Module({
  controllers: [UploadController],
  providers: [ImageKitService],
  exports: [ImageKitService],
})
export class ImageKitModule {}
