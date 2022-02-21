import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Province, ProvinceSchema } from './province.schema';
import { ProvinceService } from './province.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Province.name, schema: ProvinceSchema },
    ]),
  ],
  controllers: [],
  providers: [ProvinceService],
})
export class ProvinceModule {}
