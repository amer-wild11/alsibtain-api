import { Module } from '@nestjs/common';
import { GalleryController } from './gallery.controller';
import { ImageKitModule } from 'src/image-kit/image-kit.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallery, GallerySchema } from './schemas/gallery.schema';
import { GalleryService } from './gallery.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Gallery.name, schema: GallerySchema }]),
    ImageKitModule,
  ],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
