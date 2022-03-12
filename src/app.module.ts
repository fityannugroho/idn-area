import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProvinceModule } from './province/province.module';
import { RegencyModule } from './regency/regency.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: process.env.MONGODB_URI }),
    }),
    ProvinceModule,
    RegencyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
