import { Module } from '@nestjs/common';
import { ProjectsUpdatesService } from './projects-updates.service';
import { ProjectsUpdatesController } from './projects-updates.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Updates, UpdatesSchema } from './schemas/updates.schema';
import { ImageKitModule } from 'src/image-kit/image-kit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Updates.name, schema: UpdatesSchema }]),
    ImageKitModule,
  ],
  providers: [ProjectsUpdatesService],
  controllers: [ProjectsUpdatesController],
})
export class ProjectsUpdatesModule {}
