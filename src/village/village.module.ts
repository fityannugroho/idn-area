import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperModule } from 'src/helper/helper.module';
import { VillageController } from './village.controller';
import { Village, VillageSchema } from './village.schema';
import { VillageService } from './village.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Village.name, schema: VillageSchema }]),
    HelperModule,
  ],
  controllers: [VillageController],
  providers: [VillageService],
})
export class VillageModule {}
