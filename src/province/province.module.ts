import { Module } from '@nestjs/common';
import { HelperModule } from 'src/helper/helper.module';
import { PrismaService } from 'src/prisma.service';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

@Module({
  imports: [HelperModule],
  controllers: [ProvinceController],
  providers: [PrismaService, ProvinceService],
})
export class ProvinceModule {}
