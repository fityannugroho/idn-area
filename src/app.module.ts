import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DistrictModule } from './district/district.module';
import { HelperModule } from './helper/helper.module';
import { ProvinceModule } from './province/province.module';
import { RegencyModule } from './regency/regency.module';
import { VillageModule } from './village/village.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProvinceModule,
    RegencyModule,
    DistrictModule,
    HelperModule,
    VillageModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
