import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGalleryDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}
