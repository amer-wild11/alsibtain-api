import { Module } from '@nestjs/common';
import { ProjectSliderService } from './project-slider.service';
import { ProjectSliderController } from './project-slider.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectSlider,
  ProjectSliderSchema,
} from './schemas/project-slider.schema';
import { ImageKitModule } from 'src/image-kit/image-kit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectSlider.name, schema: ProjectSliderSchema },
    ]),
    ImageKitModule,
  ],
  providers: [ProjectSliderService],
  controllers: [ProjectSliderController],
})
export class ProjectSliderModule {}
