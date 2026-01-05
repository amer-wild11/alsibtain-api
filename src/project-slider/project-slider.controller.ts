import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ProjectSliderService } from './project-slider.service';
import { CreateProjectSliderDto } from './dto/create-project-slider.dto';
import { UpdateProjectDto } from 'src/projects/dto/update-project.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateProjectSliderDto } from './dto/update-project-slider.dto';

@Controller('project-slider')
export class ProjectSliderController {
  constructor(private readonly projectSliderService: ProjectSliderService) {}

  @Get()
  getAll(@Query('search') search: string) {
    return this.projectSliderService.getAll(search);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.projectSliderService.getOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body() data: CreateProjectSliderDto,
    @UploadedFile() video: Express.Multer.File,
  ) {
    return this.projectSliderService.create(data, video);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('video'))
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() data: UpdateProjectSliderDto,
    @UploadedFile() video?: Express.Multer.File,
  ) {
    return this.projectSliderService.update(id, data, video);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.projectSliderService.delete(id);
  }
}
