import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { PaginationDto } from 'src/common/pagination.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message>,
  ) {}

  async getMessages(
    paginationDto?: PaginationDto,
    search?: string,
    subjects?: string[],
  ) {
    const { page = 1, limit = 30 } = paginationDto || {};

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const skip = (page - 1) * limit;

    const matchQuery: any = {};

    if (search) {
      matchQuery.firstName = { $regex: search, $options: 'i' };
    }

    if (subjects?.length) {
      matchQuery.subject = { $in: subjects };
    }

    const messages = await this.messageModel
      .aggregate([
        { $match: matchQuery },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ])
      .exec();

    const totalCount = await this.messageModel.countDocuments(matchQuery);

    return {
      payload: messages,
      total: totalCount,
      page,
      lastPage: Math.ceil(totalCount / limit),
      message: 'Messages retrieved successfully',
    };
  }

  async getById(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid message id');
    }

    const message = await this.messageModel.findById(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return message;
  }

  async create(data: CreateMessageDto) {
    const message = await this.messageModel.create(data);
    return {
      message: 'Message created successfully',
      payload: message,
    };
  }

  async update(id: string, data: UpdateMessageDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid message id');
    }

    const message = await this.messageModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return {
      message: 'Message updated successfully',
      payload: message,
    };
  }

  async delete(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid message id');
    }

    const message = await this.messageModel.findByIdAndDelete(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return {
      message: 'Message deleted successfully',
    };
  }
}
