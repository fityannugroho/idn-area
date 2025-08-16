/**
 * Test Helper Utilities
 *
 * Common utility functions untuk testing yang bisa digunakan across test files.
 * Menyediakan helper functions untuk setup, assertions, dan common test patterns.
 */

import type { MockPrismaService } from '../mocks/prisma.mock';

/**
 * Helper untuk setup mock dengan return values yang umum digunakan
 */
export class PrismaMockHelper {
  constructor(private mockPrisma: MockPrismaService) {}

  /**
   * Setup paginator untuk return data dengan pagination metadata
   */
  setupPaginator<T>(data: T[], total?: number) {
    const response = {
      data,
      meta: {
        total: total ?? data.length,
        pages: {
          first: 1,
          last: Math.ceil((total ?? data.length) / 10),
          current: 1,
          previous: null,
          next: total && total > 10 ? 2 : null,
        },
      },
    };

    this.mockPrisma.paginator.mockResolvedValue(response);
    return response;
  }

  /**
   * Setup findUnique untuk return specific item
   */
  setupFindUnique<T>(model: keyof MockPrismaService, item: T | null) {
    if (
      typeof this.mockPrisma[model] === 'object' &&
      this.mockPrisma[model] !== null
    ) {
      const modelMock = this.mockPrisma[model] as any;
      if (modelMock.findUnique) {
        modelMock.findUnique.mockResolvedValue(item);
      }
    }
    return item;
  }

  /**
   * Setup findMany untuk return array of items
   */
  setupFindMany<T>(model: keyof MockPrismaService, items: T[]) {
    if (
      typeof this.mockPrisma[model] === 'object' &&
      this.mockPrisma[model] !== null
    ) {
      const modelMock = this.mockPrisma[model] as any;
      if (modelMock.findMany) {
        modelMock.findMany.mockResolvedValue(items);
      }
    }
    return items;
  }

  /**
   * Setup count untuk return number
   */
  setupCount(model: keyof MockPrismaService, count: number) {
    if (
      typeof this.mockPrisma[model] === 'object' &&
      this.mockPrisma[model] !== null
    ) {
      const modelMock = this.mockPrisma[model] as any;
      if (modelMock.count) {
        modelMock.count.mockResolvedValue(count);
      }
    }
    return count;
  }

  /**
   * Setup error untuk testing error scenarios
   */
  setupError(method: string, error: Error) {
    const [model, methodName] = method.split('.');
    if (model === 'paginator') {
      this.mockPrisma.paginator.mockRejectedValue(error);
    } else if (
      typeof this.mockPrisma[model as keyof MockPrismaService] === 'object'
    ) {
      const modelMock = this.mockPrisma[
        model as keyof MockPrismaService
      ] as any;
      if (modelMock[methodName]) {
        modelMock[methodName].mockRejectedValue(error);
      }
    }
  }

  /**
   * Reset all mocks
   */
  resetAllMocks() {
    vi.clearAllMocks();
  }
}

/**
 * Common assertion helpers
 */

/**
 * Assert that paginator was called with correct parameters
 */
export const expectPaginatorCalled = (
  mockPrisma: MockPrismaService,
  expectedArgs: any,
) => {
  expect(mockPrisma.paginator).toHaveBeenCalledWith(
    expect.objectContaining(expectedArgs),
  );
};

/**
 * Assert that findUnique was called with correct where clause
 */
export const expectFindUniqueCalled = (
  mockPrisma: MockPrismaService,
  model: string,
  whereClause: any,
) => {
  const modelMock = (mockPrisma as any)[model];
  expect(modelMock.findUnique).toHaveBeenCalledWith({
    where: whereClause,
  });
};

/**
 * Assert that response has correct structure for paginated data
 */
export const expectPaginatedResponse = (
  response: any,
  expectedDataLength?: number,
) => {
  expect(response).toHaveProperty('data');
  expect(response).toHaveProperty('meta');
  expect(response.meta).toHaveProperty('total');
  expect(response.meta).toHaveProperty('pages');

  if (expectedDataLength !== undefined) {
    expect(response.data).toHaveLength(expectedDataLength);
  }

  expect(Array.isArray(response.data)).toBe(true);
};

/**
 * Assert that item has required properties
 */
export const expectItemStructure = <T>(
  item: T,
  requiredProperties: (keyof T)[],
) => {
  for (const prop of requiredProperties) {
    expect(item).toHaveProperty(String(prop));
  }
};

/**
 * Test scenario builders
 */

/**
 * Build common test scenarios untuk CRUD operations
 */
export const buildCrudScenarios = <T>(
  mockData: T[],
  createMockItem: (overrides?: Partial<T>) => T,
) => {
  return {
    // Find all scenarios
    findAll: {
      empty: { mockData: [], expectedLength: 0 },
      withData: { mockData, expectedLength: mockData.length },
      largeDataset: {
        mockData: Array(50)
          .fill(null)
          .map((_, i) => createMockItem({ id: i } as any)),
        expectedLength: 50,
      },
    },

    // Find by ID scenarios
    findById: {
      found: {
        mockData: mockData[0] || createMockItem(),
        expectedResult: mockData[0] || createMockItem(),
      },
      notFound: { mockData: null, expectedResult: null },
    },

    // Filter scenarios
    filter: {
      noMatch: { mockData: [], expectedLength: 0 },
      someMatch: { mockData: mockData.slice(0, 2), expectedLength: 2 },
      allMatch: { mockData, expectedLength: mockData.length },
    },
  };
};

/**
 * Build error scenarios
 */
export const buildErrorScenarios = () => {
  return {
    databaseError: new Error('Database connection failed'),
    validationError: new Error('Validation failed'),
    notFoundError: new Error('Record not found'),
    timeoutError: new Error('Query timeout'),
  };
};

/**
 * Performance testing helpers
 */

/**
 * Measure execution time of async function
 */
export const measureExecutionTime = async <T>(
  fn: () => Promise<T>,
): Promise<{ result: T; duration: number }> => {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return { result, duration: end - start };
};

/**
 * Create large dataset untuk performance testing
 */
export const createLargeDataset = <T>(
  createItem: (index: number) => T,
  size: number,
): T[] => {
  return Array.from({ length: size }, (_, index) => createItem(index));
};
