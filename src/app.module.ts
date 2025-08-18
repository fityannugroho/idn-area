import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { DistrictModule } from './district/district.module';
import { IslandModule } from './island/island.module';
import { ProvinceModule } from './province/province.module';
import { RegencyModule } from './regency/regency.module';
import { VillageModule } from './village/village.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProvinceModule,
    RegencyModule,
    DistrictModule,
    VillageModule,
    IslandModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: seconds(config.get('APP_THROTTLE_TTL') as number),
          limit: config.get('APP_THROTTLE_LIMIT') as number,
          skipIf: () => config.get('APP_ENABLE_THROTTLE') !== 'true',
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
