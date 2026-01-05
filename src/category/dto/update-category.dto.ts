import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class CategoryNameDto {
  @IsString()
  ar: string;

  @IsString()
  en: string;
}

export class UpdateCategoryDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => CategoryNameDto)
  name?: CategoryNameDto;
}
