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

export class CreateTestimonialDto {
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  clientType: LangForm;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  location?: LangForm;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  testimonial: LangForm;

  @IsNotEmpty()
  @IsString()
  stars: string;
}
