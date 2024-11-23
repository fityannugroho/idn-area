import { PrismaModule } from '@/prisma/prisma.module';
import { RegencyModule } from '@/regency/regency.module';
import { Module } from '@nestjs/common';
import { ProvinceController } from './province.controller';
import { ProvinceService } from './province.service';

@Module({
  imports: [PrismaModule, RegencyModule],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvinceModule {}
