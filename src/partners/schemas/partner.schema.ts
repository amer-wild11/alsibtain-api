import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as paginationDto from 'src/common/pagination.dto';

export type PartnerDocument = Partner & Document;

@Schema({ timestamps: true })
export class Partner {
  @Prop({ type: String, required: true, unique: true, index: true })
  name: string;
  @Prop(paginationDto.AssetTypeSchemaDefinition)
  logo: paginationDto.AssetType;
}

export const PartnerSchema = SchemaFactory.createForClass(Partner);

PartnerSchema.virtual('portfolios', {
  ref: 'Portfolio',
  localField: '_id',
  foreignField: 'client',
  justOne: false,
});
