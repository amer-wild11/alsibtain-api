import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job extends Document {
  // Multilingual fields
  @Prop({
    required: true,
    type: { ar: String, en: String },
  })
  title: { ar: string; en: string };

  @Prop({
    required: true,
    type: { ar: String, en: String },
  })
  experience: { ar: string; en: string };

  @Prop({ required: true })
  deadline: Date;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Application' }] })
  applications: Types.ObjectId[];

  @Prop({
    type: { ar: String, en: String },
    required: false,
  })
  description?: { ar?: string; en?: string };

  @Prop({
    type: { ar: String, en: String },
    required: false,
  })
  location?: { ar?: string; en?: string };

  @Prop({
    type: { ar: String, en: String },
    required: false,
  })
  jobType?: { ar?: string; en?: string };

  @Prop({
    type: { ar: String, en: String },
    required: false,
  })
  workingHours?: { ar?: string; en?: string };

  @Prop({
    type: { ar: String, en: String },
    required: false,
  })
  workingDays?: { ar?: string; en?: string };

  @Prop({ default: 1 })
  vacancy?: number;
}

export const JobSchema = SchemaFactory.createForClass(Job);
