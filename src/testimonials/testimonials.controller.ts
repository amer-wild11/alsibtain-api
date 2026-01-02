import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Delete,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TestimonialsService } from './testimonials.service';
import { PaginationDto } from 'src/common/pagination.dto';
import { CreateTestimonialDto } from './dto/create-testimonia.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  async getAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.testimonialsService.getAll(paginationDto, search);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.testimonialsService.getById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() data: CreateTestimonialDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.testimonialsService.create(data, image);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() data: Partial<CreateTestimonialDto>,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.testimonialsService.update(id, data, image);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.testimonialsService.delete(id);
  }
}
