import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as paginationDto from 'src/common/pagination.dto';

@Schema({
  timestamps: true,
})
export class ProjectSlider {
  @Prop({ ...paginationDto.AssetTypeSchemaDefinition })
  video: paginationDto.AssetType;
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  area: string;
  @Prop({ required: true, type: String })
  location: string;
  @Prop({ required: false, type: String })
  link: string;
  @Prop({ required: false, type: String })
  projectLink: string;
}

export const ProjectSliderSchema = SchemaFactory.createForClass(ProjectSlider);
