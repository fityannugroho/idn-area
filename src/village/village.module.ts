import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

@Module({
  imports: [PrismaModule],
  controllers: [VillageController],
  providers: [VillageService],
  exports: [VillageService],
})
export class VillageModule {}
