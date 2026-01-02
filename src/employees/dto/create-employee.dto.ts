import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class EmployeeImageDto {
  @IsString()
  @IsNotEmpty()
  fileId: string;

  @IsString()
  @IsNotEmpty()
  url: string;
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  position: string;

  @ValidateNested()
  @Type(() => EmployeeImageDto)
  image: EmployeeImageDto;

  @IsOptional()
  @IsNumber()
  order?: number;
}
