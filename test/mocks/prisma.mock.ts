/**
 * Shared Prisma Mock Factory
 *
 * Centralized mocking for PrismaService that can be used in all test files.
 * Only mock methods that are actually used to maintain simplicity.
 */

import type { Mock } from 'vitest';

/**
 * Type-safe mock Prisma service type
 */
export interface MockPrismaService {
  paginator: Mock;
  province: {
    findUnique: Mock;
    findMany: Mock;
    count: Mock;
    create: Mock;
    update: Mock;
    delete: Mock;
  };
  regency: {
    findUnique: Mock;
    findMany: Mock;
    count: Mock;
  };
  district: {
    findUnique: Mock;
    findMany: Mock;
    count: Mock;
  };
  village: {
    findUnique: Mock;
    findMany: Mock;
    count: Mock;
  };
  island: {
    findUnique: Mock;
    findMany: Mock;
    count: Mock;
  };
  $connect: Mock;
  $disconnect: Mock;
  $transaction: Mock;
}

/**
 * Creates a mock PrismaService with commonly used methods
 *
 * @example
 * ```typescript
 * const mockPrisma = createMockPrismaService();
 * mockPrisma.paginator.mockResolvedValue({ data: [] });
 * ```
 */
export const createMockPrismaService = (): MockPrismaService => ({
  // Custom pagination method
  paginator: vi.fn(),

  // Province model methods
  province: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },

  // Regency model methods
  regency: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },

  // District model methods
  district: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },

  // Village model methods
  village: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },

  // Island model methods
  island: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
  },

  // Prisma client methods
  $connect: vi.fn(),
  $disconnect: vi.fn(),
  $transaction: vi.fn(),
});

/**
 * Helper function to create paginated response
 */
export const createMockPaginatedResponse = <T>(data: T[], total?: number) => ({
  data,
  meta: {
    total: total ?? data.length,
    pages: {
      first: 1,
      last: Math.ceil((total ?? data.length) / 10),
      current: 1,
      previous: null,
      next: null,
    },
  },
});

/**
 * Helper function to setup common mock behaviors
 */
export const setupCommonMocks = (mockPrisma: MockPrismaService) => {
  // Default successful connection
  mockPrisma.$connect.mockResolvedValue(undefined);
  mockPrisma.$disconnect.mockResolvedValue(undefined);

  // Default empty results
  mockPrisma.province.findMany.mockResolvedValue([]);
  mockPrisma.regency.findMany.mockResolvedValue([]);
  mockPrisma.district.findMany.mockResolvedValue([]);
  mockPrisma.village.findMany.mockResolvedValue([]);
  mockPrisma.island.findMany.mockResolvedValue([]);

  // Default count results
  mockPrisma.province.count.mockResolvedValue(0);
  mockPrisma.regency.count.mockResolvedValue(0);
  mockPrisma.district.count.mockResolvedValue(0);
  mockPrisma.village.count.mockResolvedValue(0);
  mockPrisma.island.count.mockResolvedValue(0);
};
