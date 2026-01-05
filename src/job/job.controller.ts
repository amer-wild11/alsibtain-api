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
  Req,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  // ---------------- CREATE JOB ----------------
  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() body: any) {
    // Expecting FormData JSON strings for AR/EN fields
    const parsedBody: CreateJobDto = {
      ...body,
      title: typeof body.title === 'string' ? JSON.parse(body.title) : body.title,
      experience:
        typeof body.experience === 'string'
          ? JSON.parse(body.experience)
          : body.experience,
      description:
        body.description && typeof body.description === 'string'
          ? JSON.parse(body.description)
          : body.description,
      location:
        body.location && typeof body.location === 'string'
          ? JSON.parse(body.location)
          : body.location,
      jobType:
        body.jobType && typeof body.jobType === 'string'
          ? JSON.parse(body.jobType)
          : body.jobType,
      workingHours:
        body.workingHours && typeof body.workingHours === 'string'
          ? JSON.parse(body.workingHours)
          : body.workingHours,
      workingDays:
        body.workingDays && typeof body.workingDays === 'string'
          ? JSON.parse(body.workingDays)
          : body.workingDays,
      category: body.category,
      deadline: body.deadline,
      vacancy: body.vacancy,
    };

    return this.jobService.createJob(parsedBody);
  }

  // ---------------- GET ALL JOBS ----------------
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

  // ---------------- GET JOB BY ID ----------------
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }

  // ---------------- UPDATE JOB ----------------
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() body: any) {
    // Expecting FormData JSON strings for AR/EN fields
    const parsedBody: UpdateJobDto = {
      ...body,
      title: body.title && typeof body.title === 'string' ? JSON.parse(body.title) : body.title,
      experience:
        body.experience && typeof body.experience === 'string'
          ? JSON.parse(body.experience)
          : body.experience,
      description:
        body.description && typeof body.description === 'string'
          ? JSON.parse(body.description)
          : body.description,
      location:
        body.location && typeof body.location === 'string'
          ? JSON.parse(body.location)
          : body.location,
      jobType:
        body.jobType && typeof body.jobType === 'string'
          ? JSON.parse(body.jobType)
          : body.jobType,
      workingHours:
        body.workingHours && typeof body.workingHours === 'string'
          ? JSON.parse(body.workingHours)
          : body.workingHours,
      workingDays:
        body.workingDays && typeof body.workingDays === 'string'
          ? JSON.parse(body.workingDays)
          : body.workingDays,
      category: body.category,
      deadline: body.deadline,
      vacancy: body.vacancy,
    };

    return this.jobService.updateJob(id, parsedBody);
  }

  // ---------------- DELETE JOB ----------------
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.jobService.deleteJob(id);
  }
}
