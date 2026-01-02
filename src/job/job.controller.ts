import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: CreateJobDto) {
    return this.jobService.createJob(body);
  }

  @Get()
  getAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('categoryIds') categoryIds?: string,
  ) {
    return this.jobService.getAllJobs(
      paginationDto,
      search,
      categoryIds ? categoryIds.split(',') : undefined,
    );
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() body: UpdateJobDto) {
    return this.jobService.updateJob(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
