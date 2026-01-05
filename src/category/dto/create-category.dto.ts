import {
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

class LocalizedStringDto {
  @IsNotEmpty()
  @IsString()
  ar: string;

  @IsNotEmpty()
  @IsString()
  en: string;
}

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  name: LocalizedStringDto;
}
