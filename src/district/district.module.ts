import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { VillageModule } from '@/village/village.module';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

@Module({
  imports: [PrismaModule, VillageModule],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
