import { PartialType } from '@nestjs/mapped-types';
import { CreateGalleryDto } from './create-gallery.dto';

export class UpdateGalleryeDto extends PartialType(CreateGalleryDto) {}
