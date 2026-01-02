import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Employee {
  @Prop({ required: true })
  name: string;
  @Prop({ required: false })
  position: string;
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
