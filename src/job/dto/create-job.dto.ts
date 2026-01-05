import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

// Generic LangForm for ar/en fields
export class LangForm {
  @IsOptional()
  @IsString()
  ar?: string;

  @IsOptional()
  @IsString()
  en?: string;
}

export class CreateJobDto {
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @ValidateNested()
  @Type(() => LangForm)
  title: LangForm;

  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @ValidateNested()
  @Type(() => LangForm)
  experience: LangForm;

  @IsDateString()
  @IsNotEmpty()
  deadline: Date;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @ValidateNested()
  @Type(() => LangForm)
  description?: LangForm;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @ValidateNested()
  @Type(() => LangForm)
  location?: LangForm;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @ValidateNested()
  @Type(() => LangForm)
  jobType?: LangForm;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @ValidateNested()
  @Type(() => LangForm)
  workingHours?: LangForm;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? JSON.parse(value) : value))
  @ValidateNested()
  @Type(() => LangForm)
  workingDays?: LangForm;

  @IsOptional()
  @IsInt()
  vacancy?: number;
}
