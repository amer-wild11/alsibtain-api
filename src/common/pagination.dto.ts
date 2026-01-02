import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 30;
}

export interface AssetType {
  fileId: string;
  url: string;
}

export const AssetTypeSchemaDefinition = {
  type: {
    fileId: { type: String, required: true },
    url: { type: String, required: true },
  },
  required: true,
};
