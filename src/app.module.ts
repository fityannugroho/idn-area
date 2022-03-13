import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvinceModule } from './province/province.module';
import { RegencyModule } from './regency/regency.module';
import { HelperModule } from './helper/helper.module';
import { DistrictModule } from './district/district.module';
import { VillageModule } from './village/village.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: process.env.MONGODB_URI }),
    }),
    ProvinceModule,
    RegencyModule,
    DistrictModule,
    HelperModule,
    VillageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
