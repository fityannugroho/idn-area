import { Module } from '@nestjs/common';
import { PrismaService } from '~/src/common/services/prisma';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

@Module({
  imports: [],
  controllers: [RegencyController],
  providers: [PrismaService, RegencyService],
})
export class RegencyModule {}
