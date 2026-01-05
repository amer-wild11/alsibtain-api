import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as paginationDto from 'src/common/pagination.dto';
import { LangForm } from 'src/project-slider/dto/create-project-slider.dto';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({
    required: true,
    type: {
      ar: String,
      en: String,
    },
  })
  name: LangForm;

  @Prop({
    required: true,
    type: {
      ar: String,
      en: String,
    },
  })
  caption: LangForm;

  @Prop(paginationDto.AssetTypeSchemaDefinition)
  logo: paginationDto.AssetType;

  @Prop(paginationDto.AssetTypeSchemaDefinition)
  background: paginationDto.AssetType;

  @Prop({
    required: true,
    type: {
      ar: String,
      en: String,
    },
  })
  projectFullName: LangForm;

  @Prop({
    required: true,
    type: {
      ar: String,
      en: String,
    },
  })
  location: LangForm;

  @Prop({ required: true, type: String })
  totalArea: string;

  @Prop({ required: true, type: String })
  totalResidentialUnits: string;

  @Prop({
    required: true,
    type: {
      ar: String,
      en: String,
    },
  })
  unitType: LangForm;

  @Prop({
    required: true,
    type: {
      ar: String,
      en: String,
    },
  })
  description: LangForm;

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

  @Prop({
    type: [paginationDto.AssetTypeSchemaDefinition],
    required: false,
    default: [],
  })
  imageGallery?: paginationDto.AssetType[];

  @Prop({
    type: [paginationDto.AssetTypeSchemaDefinition],
    required: false,
    default: [],
  })
  videoGallery?: paginationDto.AssetType[];

  @Prop({ default: false, type: Boolean })
  showUrukCity360: boolean;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
