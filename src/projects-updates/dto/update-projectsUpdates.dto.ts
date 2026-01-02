import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectsUpdatesDto } from './create-updates.dto';

export class UpdateProjectsUpdatesDto extends PartialType(
  CreateProjectsUpdatesDto,
) {}
