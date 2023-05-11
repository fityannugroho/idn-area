import { Module } from '@nestjs/common';
import { HelperModule } from '~/src/helper/helper.module';
import { PrismaService } from '~/src/prisma.service';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';

@Module({
  imports: [HelperModule],
  controllers: [DistrictController],
  providers: [DistrictService, PrismaService],
})
export class DistrictModule {}
