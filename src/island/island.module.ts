import { Module } from '@nestjs/common';
import { IslandController } from './island.controller';
import { IslandService } from './island.service';
import { PrismaService } from '../common/services/prisma';

@Module({
  providers: [IslandService, PrismaService],
  controllers: [IslandController],
})
export class IslandModule {}
