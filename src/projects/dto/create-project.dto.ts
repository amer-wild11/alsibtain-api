import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  ValidateNested,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class LangForm {
  @IsOptional()
  @IsString()
  ar?: string;

  @IsOptional()
  @IsString()
  en?: string;
}

export class CreateProjectDto {
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  name: LangForm;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  caption: LangForm;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  projectFullName: LangForm;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  location: LangForm;

  @IsNotEmpty()
  @IsString()
  totalArea: string;

  @IsNotEmpty()
  @IsString()
  totalResidentialUnits: string;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  unitType: LangForm;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  description: LangForm;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  showUrukCity360?: boolean;
}
