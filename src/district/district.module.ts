import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

@Module({
  imports: [PrismaModule],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule {}
