import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ timestamps: true })

export class Video {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  fileId: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
