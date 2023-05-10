import { Module } from '@nestjs/common';
import { HelperModule } from '~/src/helper/helper.module';
import { PrismaService } from '~/src/prisma.service';
import { RegencyController } from './regency.controller';
import { RegencyService } from './regency.service';

@Module({
  imports: [HelperModule],
  controllers: [RegencyController],
  providers: [PrismaService, RegencyService],
})
export class RegencyModule {}
