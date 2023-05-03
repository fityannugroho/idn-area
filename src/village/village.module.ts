import { Module } from '@nestjs/common';
import { HelperModule } from 'src/helper/helper.module';
import { PrismaService } from 'src/prisma.service';
import { VillageController } from './village.controller';
import { VillageService } from './village.service';

@Module({
  imports: [HelperModule],
  controllers: [VillageController],
  providers: [PrismaService, VillageService],
})
export class VillageModule {}
