import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectsUpdatesDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  writtenBy: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
