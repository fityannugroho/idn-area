import {
  District,
  Island,
  Prisma,
  Province,
  Regency,
  Village,
} from '@prisma/client';
import { PaginationQuery } from '@/common/dto/pagination.dto';

export type Models = keyof typeof Prisma.ModelName;

export type FunctionType<T extends Models> =
  Prisma.TypeMap['model'][T]['operations'];

export type FunctionNames<T extends Models> = keyof FunctionType<T>;

export type Model<T extends Models> = T extends 'Province'
  ? Province
  : T extends 'Regency'
    ? Regency
    : T extends 'District'
      ? District
      : T extends 'Village'
        ? Village
        : T extends 'Island'
          ? Island
          : never;

export type ArgsType<
  T extends Models,
  Fn extends FunctionNames<T>,
> = FunctionType<T>[Fn] extends (args: infer U) => any ? U : never;

export type PaginatorOptions<T extends Models> = {
  model: T;
  paginate: PaginationQuery;
  args?: FunctionType<T>['count']['args'];
};

export type MethodDelegate<T extends Models> = {
  count: (args?: ArgsType<T, 'count'>) => Promise<number>;
  findMany: (args?: ArgsType<T, 'findMany'>) => Promise<Model<T>[]>;
};
