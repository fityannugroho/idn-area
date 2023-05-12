import { Module } from '@nestjs/common';
import { PrismaService } from '~/src/common/services/prisma';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

@Module({
  imports: [],
  controllers: [ProvinceController],
  providers: [PrismaService, ProvinceService],
})
export class ProvinceModule {}
