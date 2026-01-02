import { Module } from '@nestjs/common';
import { ImageKitModule } from 'src/image-kit/image-kit.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { Video, VideoSchema } from './schemas/video.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    ImageKitModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
