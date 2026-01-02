import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectSliderDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  area: string;
  @IsString()
  @IsNotEmpty()
  location: string;
  @IsString()
  @IsOptional()
  link: string;
  @IsString()
  @IsOptional()
  projectLink: string;
}
