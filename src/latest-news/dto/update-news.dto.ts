import { PartialType } from '@nestjs/mapped-types';
import { CreateLatestNewsDto } from './create-news.dto';

export class UpdateLatestNewsDto extends PartialType(CreateLatestNewsDto) {}
