import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Employee } from './schema/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { IsMongoId, IsNumber, IsNotEmpty } from 'class-validator';
import { ImageKitService } from 'src/image-kit/image-kit.service';

export class ReorderEmployeeDto {
  @IsMongoId()
  @IsNotEmpty()
  employee: string;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<Employee>,
    private readonly imageKitService: ImageKitService,
  ) {}

  async getAll(params: {
    keywords?: string;
    fields?: string[];
    page?: number;
    limit?: number;
  }) {
    const { keywords, fields, page = 1, limit = 10 } = params;

    const skip = (page - 1) * limit;

    const matchStage =
      fields && keywords
        ? {
            $or: fields.map((field) => ({
              [field]: { $regex: keywords, $options: 'i' },
            })),
          }
        : {};

    const [data, total] = await Promise.all([
      this.employeeModel
        .find(matchStage)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.employeeModel.countDocuments(matchStage),
    ]);

    return {
      payload: data,
      message: 'Employees fetched successfully',
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async getById(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Employee id is not valid');

    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) throw new NotFoundException('Employee not found');

    return {
      message: 'Employee fetched successfully',
      payload: employee,
    };
  }

  async createEmployee(data: CreateEmployeeDto, image: Express.Multer.File) {
    if (!image) throw new BadRequestException('Employee image is required');

    try {
      // Upload image to Cloudinary

      const { fileId, url } = await this.imageKitService.upload(image, {
        folder: '/team',
      });

      // Find the current max order
      const lastEmployee = await this.employeeModel
        .findOne()
        .sort({ order: -1 })
        .select('order')
        .exec();
      const newOrder = lastEmployee ? lastEmployee.order + 1 : 1;

      // Create employee with the correct order
      const employee = await this.employeeModel.create({
        ...data,
        order: newOrder,
        image: {
          fileId,
          url,
        },
      });

      return {
        message: 'Employee created successfully',
        payload: employee,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateEmployee(
    id: string,
    data: UpdateEmployeeDto,
    image?: Express.Multer.File,
  ) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Employee id is not valid');

    const employee = await this.employeeModel
      .findById(id)
      .select('_id image')
      .exec();

    if (!employee) throw new NotFoundException('Employee not found');

    let dataToUpdate: UpdateEmployeeDto & {
      image?: { fileId?: string; url?: string };
    } = { ...data };

    if (image) {
      try {
        // delete old image
        if (employee.image?.url) {
          await this.imageKitService.deleteFile(employee.image.fileId);
        }
        // upload new image
        const { fileId, url } = await this.imageKitService.upload(image, {
          folder: 'employees/images',
        });
        dataToUpdate.image = { url, fileId };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }

    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true },
    );

    return {
      message: 'Employee updated successfully',
      payload: updatedEmployee,
    };
  }

  async deleteEmployee(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('Employee id is not valid');

    const employee = await this.employeeModel
      .findById(id)
      .select('_id image')
      .exec();

    if (!employee) throw new NotFoundException('Employee not found');

    if (employee.image?.fileId) {
      await this.imageKitService.deleteFile(employee.image.fileId);
    }

    await this.employeeModel.deleteOne({ _id: id });

    return {
      message: 'Employee deleted successfully',
    };
  }

  async reorderEmployees(reorderData: { employee: string; order: number }[]) {
    if (!Array.isArray(reorderData) || reorderData.length === 0) {
      throw new BadRequestException('Reorder data must be a non-empty array');
    }

    // Validate IDs
    reorderData.forEach((item) => {
      if (!isValidObjectId(item.employee)) {
        throw new BadRequestException(`Invalid employee ID: ${item.employee}`);
      }
    });

    // Bulk update all employees with new order
    const bulkOps = reorderData.map((item) => ({
      updateOne: {
        filter: { _id: item.employee },
        update: { $set: { order: item.order } },
      },
    }));

    try {
      await this.employeeModel.bulkWrite(bulkOps as any);
    } catch (error) {
      throw new InternalServerErrorException('Failed to reorder employees');
    }

    // Return updated employees sorted by order
    const employees = await this.employeeModel.find().sort({ order: 1 }).exec();

    return {
      message: 'Employees reordered successfully',
      payload: employees,
    };
  }
}
