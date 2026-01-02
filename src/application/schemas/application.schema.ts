import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  address: string;
  @Prop({ required: true })
  city: string;
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  job: Types.ObjectId;
  @Prop({
    type: {
      fileId: { type: String, required: true },
      url: { type: String, required: true },
    },
    required: true,
  })
  coverLetter: {
    fileId: string;
    url: string;
  };
  @Prop({ required: true })
  startDate: string;
  @Prop({
    type: {
      fileId: { type: String, required: true },
      url: { type: String, required: true },
    },
    required: true,
  })
  cv: {
    fileId: string;
    url: string;
  };
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
