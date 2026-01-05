import { Transform, Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested } from 'class-validator';

export class LangForm {
  @IsOptional()
  @IsString()
  ar?: string;

  @IsOptional()
  @IsString()
  en?: string;
}

export class UpdateProjectSliderDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  name: LangForm;

  @IsOptional()
  @IsString()
  area: string;

  @IsOptional()
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
