import { Module } from '@nestjs/common';
import { DistrictModule } from '@/district/district.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { IslandModule } from '../island/island.module';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

@Module({
  imports: [PrismaModule, DistrictModule, IslandModule],
  controllers: [RegencyController],
  providers: [RegencyService],
  exports: [RegencyService],
})
export class RegencyModule {}
