import { PartialType } from '@nestjs/mapped-types';
import { CreateTestimonialDto } from './create-testimonia.dto';

export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}
