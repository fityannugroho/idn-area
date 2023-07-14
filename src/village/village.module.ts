import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

@Module({
  imports: [PrismaModule],
  controllers: [VillageController],
  providers: [VillageService],
})
export class VillageModule {}
