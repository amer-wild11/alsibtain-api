import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';

export class LangForm {
  @IsOptional()
  @IsString()
  ar?: string;

  @IsOptional()
  @IsString()
  en?: string;
}

export class CreateProjectSliderDto {
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  name: LangForm;

  @IsNotEmpty()
  @IsString()
  area: string;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  location: LangForm;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  projectLink?: string;
}
