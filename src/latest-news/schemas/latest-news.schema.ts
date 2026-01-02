import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LatestNewsDocument = LatestNews & Document;

@Schema({ timestamps: true })
export class LatestNews {
  @Prop({ type: Object, required: true })
  thumbnail: { fileId: string; url: string };

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  writtenBy: string;

  @Prop({ type: String, required: true })
  caption: string;

  @Prop({ type: String, required: true })
  category: string;
}

export const LatestNewsSchema = SchemaFactory.createForClass(LatestNews);
