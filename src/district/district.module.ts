import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { VillageModule } from '@/village/village.module';

@Module({
  imports: [PrismaModule, VillageModule],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
