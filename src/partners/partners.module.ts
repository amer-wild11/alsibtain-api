import { Module } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { PartnersController } from './partners.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PartnerSchema } from './schemas/partner.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { ImageKitModule } from 'src/image-kit/image-kit.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: PartnerSchema, name: 'Partner' }]),
    ImageKitModule,
  ],
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [MongooseModule, PartnersService],
})
export class PartnersModule {}
