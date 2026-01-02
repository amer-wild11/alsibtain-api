import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  experience: string;

  @Prop({ required: true })
  deadline: Date;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Application' }] })
  applications: ObjectId[];

  @Prop()
  description?: string;

  @Prop()
  location?: string;

  @Prop()
  jobType?: string;

  @Prop()
  workingHours?: string;

  @Prop()
  workingDays?: string;

  @Prop({ default: 1 })
  vacancy?: number;
}

export const JobSchema = SchemaFactory.createForClass(Job);
