import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { DistrictModule } from './district/district.module';
import { IslandModule } from './island/island.module';
import { ProvinceModule } from './province/province.module';
import { RegencyModule } from './regency/regency.module';
import { VillageModule } from './village/village.module';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';

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
          ttl: seconds(config.get('APP_THROTTLE_TTL')),
          limit: config.get('APP_THROTTLE_LIMIT'),
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
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
