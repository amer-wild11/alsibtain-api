import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Employee {
  @Prop({
    required: true,
    type: {
      ar: String,
      en: String,
    },
  })
  name: { ar: string; en: string };
  @Prop({
    required: false,
    type: {
      ar: String,
      en: String,
    },
  })
  position: { ar: string; en: string };
  @Prop({
    required: true,
    type: {
      fileId: { type: String, required: true },
      url: { type: String, required: true },
    },
  })
  image: {
    fileId: string;
    url: string;
  };
  @Prop({ type: Number, required: false })
  order: number;
}

export const employeeSchema = SchemaFactory.createForClass(Employee);
