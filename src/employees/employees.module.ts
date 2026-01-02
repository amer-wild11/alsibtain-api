import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { employeeSchema } from './schema/employee.schema';
import { ImageKitModule } from 'src/image-kit/image-kit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Employee',
        schema: employeeSchema,
      },
    ]),
    ImageKitModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
