import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema } from './schemas/job.schema';
import { CategoryModule } from 'src/category/category.module';
import { Category, CategorySchema } from 'src/category/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { schema: JobSchema, name: 'Job' },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [JobService],
  controllers: [JobController],
})
export class JobModule {}
