import { Module } from '@nestjs/common';
import { PrismaService } from '~/src/common/services/prisma';
import { IslandModule } from '../island/island.module';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

@Module({
  imports: [IslandModule],
  controllers: [RegencyController],
  providers: [PrismaService, RegencyService],
})
export class RegencyModule {}
