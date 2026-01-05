import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UpdatesDocument = Updates & Document;

@Schema({ timestamps: true })
export class Updates {
  @Prop({ type: Object, required: true })
  thumbnail: { fileId: string; url: string };
  @Prop({
    type: {
      ar: String,
      en: String,
    },
    required: true,
  })
  title: {
    ar: string;
    en: string;
  };
  @Prop({
    type: {
      ar: String,
      en: String,
    },
    required: true,
  })
  writtenBy: {
    ar: string;
    en: string;
  };
  @Prop({
    type: {
      ar: String,
      en: String,
    },
    required: true,
  })
  description: {
    ar: string;
    en: string;
  };
}

export const UpdatesSchema = SchemaFactory.createForClass(Updates);
