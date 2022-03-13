import { Module } from '@nestjs/common';
import { SortHelper } from './sort.helper';

@Module({
  providers: [SortHelper],
  exports: [SortHelper],
})
export class HelperModule {}
