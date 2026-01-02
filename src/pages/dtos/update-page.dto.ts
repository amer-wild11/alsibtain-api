import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdatePageDto {
  @IsString()
  pageName: string;

  @IsString()
  sectionName: string;

  @IsOptional()
  @IsString()
  contentName?: string;

  @IsOptional()
  @IsObject()
  value?: Record<string, any>;
}
