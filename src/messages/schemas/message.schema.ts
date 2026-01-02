import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: String, required: true })
  firstName: string;
  @Prop({ type: String, required: true })
  lastName: string;
  @Prop({ type: String, required: true })
  email: string;
  @Prop({ type: String, required: true })
  phoneNumber: string;
  @Prop({ type: String, required: true })
  subject: string;
  @Prop({ type: String, required: true })
  message: string;
}

export const MessagesSchema = SchemaFactory.createForClass(Message);
