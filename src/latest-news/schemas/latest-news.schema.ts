import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LatestNewsDocument = LatestNews & Document;

@Schema({ timestamps: true })
export class LatestNews {
  @Prop({ type: Object, required: true })
  thumbnail: { fileId: string; url: string };

  @Prop({ type: { ar: String, en: String }, required: true })
  title: { ar: string; en: string };

  @Prop({ type: { ar: String, en: String }, required: true })
  writtenBy: { ar: string; en: string };

  @Prop({ type: { ar: String, en: String }, required: true })
  caption: { ar: string; en: string };

  @Prop({ type: { ar: String, en: String }, required: true })
  category: { ar: string; en: string };
}

export const LatestNewsSchema = SchemaFactory.createForClass(LatestNews);
