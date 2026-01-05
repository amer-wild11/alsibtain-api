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
import { ImageKitService } from 'src/image-kit/image-kit.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<Employee>,
    private readonly imageKitService: ImageKitService,
  ) {}

  async getAll(params: { keywords?: string; page?: number; limit?: number }) {
    const { keywords, page = 1, limit = 10 } = params;

    const skip = (page - 1) * limit;

    const matchQuery: any = {};

    if (keywords) {
      matchQuery.$or = [
        { 'name.ar': { $regex: keywords, $options: 'i' } },
        { 'name.en': { $regex: keywords, $options: 'i' } },
        { 'position.ar': { $regex: keywords, $options: 'i' } },
        { 'position.en': { $regex: keywords, $options: 'i' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.employeeModel
        .find(matchQuery)
        .sort({ order: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.employeeModel.countDocuments(matchQuery),
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
      const { fileId, url } = await this.imageKitService.upload(image, {
        folder: '/employees',
      });

      const lastEmployee = await this.employeeModel
        .findOne()
        .sort({ order: -1 })
        .select('order')
        .exec();

      const order = lastEmployee ? lastEmployee.order + 1 : 1;

      const employee = await this.employeeModel.create({
        name: data.name,
        position: data.position,
        order,
        image: { fileId, url },
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

    const employee = await this.employeeModel.findById(id).exec();

    if (!employee) throw new NotFoundException('Employee not found');

    const updateData: any = {
      ...(data.name && { name: data.name }),
      ...(data.position && { position: data.position }),
      ...(data.order !== undefined && { order: data.order }),
    };

    if (image) {
      try {
        if (employee.image?.fileId) {
          await this.imageKitService.deleteFile(employee.image.fileId);
        }

        const { fileId, url } = await this.imageKitService.upload(image, {
          folder: '/employees',
        });

        updateData.image = { fileId, url };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }

    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
      id,
      updateData,
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

    const employee = await this.employeeModel.findById(id).exec();

    if (!employee) throw new NotFoundException('Employee not found');

    if (employee.image?.fileId) {
      await this.imageKitService.deleteFile(employee.image.fileId);
    }

    await this.employeeModel.deleteOne({ _id: id });

    return {
      message: 'Employee deleted successfully',
    };
  }

  async reorderEmployees(data: { employee: string; order: number }[]) {
    if (!Array.isArray(data) || data.length === 0)
      throw new BadRequestException('Invalid reorder payload');

    data.forEach((item) => {
      if (!isValidObjectId(item.employee)) {
        throw new BadRequestException(`Invalid employee ID: ${item.employee}`);
      }
    });

    const bulkOps = data.map((item) => ({
      updateOne: {
        filter: { _id: item.employee },
        update: { $set: { order: item.order } },
      },
    }));

    await this.employeeModel.bulkWrite(bulkOps as any);

    const employees = await this.employeeModel.find().sort({ order: 1 }).exec();

    return {
      message: 'Employees reordered successfully',
      payload: employees,
    };
  }
}
