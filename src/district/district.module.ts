import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperModule } from 'src/helper/helper.module';
import { DistrictController } from './district.controller';
import { District, DistrictSchema } from './district.schema';
import { DistrictService } from './district.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: District.name, schema: DistrictSchema },
    ]),
    HelperModule,
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
