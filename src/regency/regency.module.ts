import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RegencyController } from './regency.controller';
import { Regency, RegencySchema } from './regency.schema';
import { RegencyService } from './regency.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Regency.name, schema: RegencySchema }]),
  ],
  controllers: [RegencyController],
  providers: [RegencyService],
})
export class RegencyModule {}
