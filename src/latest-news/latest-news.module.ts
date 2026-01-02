import { Module } from '@nestjs/common';
import { LatestNewsService } from './latest-news.service';
import { LatestNewsController } from './latest-news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LatestNews, LatestNewsSchema } from './schemas/latest-news.schema';
import { ImageKitModule } from 'src/image-kit/image-kit.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LatestNews.name, schema: LatestNewsSchema },
    ]),
    ImageKitModule,
  ],
  providers: [LatestNewsService],
  controllers: [LatestNewsController],
})
export class LatestNewsModule {}
