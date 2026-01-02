import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLatestNewsDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  writtenBy: string;

  @IsNotEmpty()
  @IsString()
  caption: string;

  @IsNotEmpty()
  @IsString()
  category: string;
}
