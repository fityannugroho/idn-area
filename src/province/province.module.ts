import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Province, ProvinceSchema } from './province.schema';
import { ProvinceService } from './province.service';
import { ProvinceController } from './province.controller';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Province.name, schema: ProvinceSchema },
    ]),
    HelperModule,
  ],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
