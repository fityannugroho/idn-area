import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { IslandController } from './island.controller';
import { IslandService } from './island.service';

@Module({
  imports: [PrismaModule],
  providers: [IslandService],
  controllers: [IslandController],
  exports: [IslandService],
})
export class IslandModule {}
