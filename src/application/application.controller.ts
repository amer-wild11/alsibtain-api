import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'cv', maxCount: 1 },
        { name: 'coverLetter', maxCount: 1 },
      ],
      {
        limits: {
          fileSize: 5 * 1024 * 1024,
        },
      },
    ),
  )
  create(
    @Body() body: CreateApplicationDto,
    @UploadedFiles()
    files: {
      cv?: Express.Multer.File[];
      coverLetter?: Express.Multer.File[];
    },
  ) {
    if (!files?.cv?.length) {
      throw new BadRequestException('CV is required');
    }

    if (!files?.coverLetter?.length) {
      throw new BadRequestException('Cover letter is required');
    }

    return this.applicationService.create(
      body,
      files.cv[0],
      files.coverLetter[0],
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getAll(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.applicationService.getAll(paginationDto, search);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getById(@Param('id') id: string) {
    return this.applicationService.getById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() body: UpdateApplicationDto) {
    return this.applicationService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.applicationService.delete(id);
  }
}
