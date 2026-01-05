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

export class CreateLatestNewsDto {
  @IsNotEmpty()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  title: LocalizedStringDto;

  @IsNotEmpty()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  writtenBy: LocalizedStringDto;

  @IsNotEmpty()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  caption: LocalizedStringDto;

  @IsNotEmpty()
  @IsObject()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LocalizedStringDto)
  category: LocalizedStringDto;
}
