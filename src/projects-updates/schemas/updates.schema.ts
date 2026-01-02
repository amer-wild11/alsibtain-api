import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UpdatesDocument = Updates & Document;

@Schema({ timestamps: true })
export class Updates {
  @Prop({ type: Object, required: true })
  thumbnail: { fileId: string; url: string };
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  writtenBy: string;
  @Prop({ type: String, required: true })
  description: string;
}

export const UpdatesSchema = SchemaFactory.createForClass(Updates);
