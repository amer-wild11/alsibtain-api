import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { ImageKitModule } from './image-kit/image-kit.module';
import { PagesModule } from './pages/pages.module';
import { EmployeesModule } from './employees/employees.module';
import { ProjectsModule } from './projects/projects.module';
import { PartnersModule } from './partners/partners.module';
import { GalleryService } from './gallery/gallery.service';
import { GalleryModule } from './gallery/gallery.module';
import { VideoModule } from './video/video.module';
import { ProjectSliderModule } from './project-slider/project-slider.module';
import { MessagesModule } from './messages/messages.module';
import { CategoryModule } from './category/category.module';
import { JobModule } from './job/job.module';
import { ApplicationController } from './application/application.controller';
import { ApplicationService } from './application/application.service';
import { ApplicationModule } from './application/application.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { LatestNewsModule } from './latest-news/latest-news.module';
import { ProjectsUpdatesModule } from './projects-updates/projects-updates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DB_URI'),
      }),
    }),

    AdminModule,
    ImageKitModule,
    PagesModule,
    EmployeesModule,
    ProjectsModule,
    PartnersModule,
    GalleryModule,
    VideoModule,
    ProjectSliderModule,
    MessagesModule,
    CategoryModule,
    JobModule,
    ApplicationModule,
    TestimonialsModule,
    LatestNewsModule,
    ProjectsUpdatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
