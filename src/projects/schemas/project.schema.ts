import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as paginationDto from 'src/common/pagination.dto';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, type: String })
  name: string;
  @Prop({ required: true, type: String })
  caption: string;
  @Prop(paginationDto.AssetTypeSchemaDefinition)
  logo: paginationDto.AssetType;
  @Prop(paginationDto.AssetTypeSchemaDefinition)
  background: paginationDto.AssetType;
  @Prop({ required: true, type: String })
  projectFullName: string;
  @Prop({ required: true, type: String })
  location: string;
  @Prop({ required: true, type: String })
  totalArea: string;
  @Prop({ required: true, type: String })
  totalResidentialUnits: string;
  @Prop({ required: true, type: String })
  unitType: string;
  @Prop({ required: true, type: String })
  description: string;
  @Prop({
    type: {
      thumbnail: paginationDto.AssetTypeSchemaDefinition,
      video: paginationDto.AssetTypeSchemaDefinition,
    },
    required: true,
  })
  introduction: {
    thumbnail: paginationDto.AssetType;
    video: paginationDto.AssetType;
  };
  @Prop({ default: false, type: Boolean })
  showUrukCity360: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
