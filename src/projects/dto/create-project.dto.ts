import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  caption: string;

  @IsString()
  projectFullName: string;

  @IsString()
  location?: string;

  @IsString()
  totalArea?: string;

  @IsString()
  totalResidentialUnits?: string;

  @IsString()
  unitType?: string;

  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  showUrukCity360?: boolean;
}
