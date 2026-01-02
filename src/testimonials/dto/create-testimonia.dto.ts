import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  clientType: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  testimonial: string;

  @IsOptional()
  @IsString()
  stars?: string;
}
