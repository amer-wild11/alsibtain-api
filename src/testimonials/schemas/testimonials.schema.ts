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

  @Prop({
    required: true,
    type: {
      ar: String,
      en: String,
    },
  })
  clientType: {
    en: string;
    ar: string;
  };

  @Prop({
    type: {
      en: String,
      ar: String,
    },
  })
  location: {
    en: String;
    ar: String;
  };

  @Prop({
    required: true,
    type: {
      en: String,
      ar: String,
    },
  })
  testimonial: {
    en: String;
    ar: String;
  };

  @Prop({ type: String, required: true, default: 5 })
  stars: string;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
