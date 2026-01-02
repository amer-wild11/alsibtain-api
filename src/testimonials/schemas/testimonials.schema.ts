import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({
    type: Object,
    required: true,
    default: { fileId: '', url: '' },
  })
  image: { fileId: string; url: string };

  @Prop({ required: true })
  clientType: string;

  @Prop()
  location: string;

  @Prop({ required: true })
  testimonial: string;

  @Prop({ type: String, required: true })
  stars: string;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
