import { Module } from '@nestjs/common';
import { PrismaService } from '~/src/prisma.service';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

@Module({
  imports: [],
  controllers: [VillageController],
  providers: [PrismaService, VillageService],
})
export class VillageModule {}
