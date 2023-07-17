import { Module } from '@nestjs/common';
import { IslandModule } from '../island/island.module';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';
import { PrismaModule } from '@/prisma/prisma.module';
import { DistrictModule } from '@/district/district.module';

@Module({
  imports: [PrismaModule, DistrictModule, IslandModule],
  controllers: [RegencyController],
  providers: [RegencyService],
  exports: [RegencyService],
})
export class RegencyModule {}
