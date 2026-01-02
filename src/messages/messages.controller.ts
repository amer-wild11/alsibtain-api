import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PaginationDto } from 'src/common/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getMessages(
    @Query() paginationDto: PaginationDto,
    @Query('search') search?: string,
    @Query('subjects') subjects?: string,
  ) {
    return this.messagesService.getMessages(
      paginationDto,
      search,
      subjects ? subjects.split(',') : undefined,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  getById(@Param('id') id: string) {
    return this.messagesService.getById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() body: UpdateMessageDto) {
    return this.messagesService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) {
    return this.messagesService.delete(id);
  }
}
