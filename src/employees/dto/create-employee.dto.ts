import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { LangForm } from 'src/project-slider/dto/create-project-slider.dto';

export class CreateEmployeeDto {
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  name: LangForm;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  @ValidateNested()
  @Type(() => LangForm)
  position?: LangForm;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : value))
  @IsNumber()
  order?: number;
}
