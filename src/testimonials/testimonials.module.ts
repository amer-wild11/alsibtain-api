import { Module } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { TestimonialsController } from './testimonials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Testimonial, TestimonialSchema } from './schemas/testimonials.schema';
import { ImageKitModule } from 'src/image-kit/image-kit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Testimonial.name,
        schema: TestimonialSchema,
      },
    ]),
    ImageKitModule,
  ],
  providers: [TestimonialsService],
  controllers: [TestimonialsController],
})
export class TestimonialsModule {}
