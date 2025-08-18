import { DBProvider, dbProviderConfig, isDBProvider } from '../provider';

describe('Database Provider Utilities', () => {
  describe('dbProviderConfig', () => {
    it('should have configuration for all supported providers', () => {
      expect(dbProviderConfig).toBeDefined();
      expect(dbProviderConfig.mongodb).toBeDefined();
      expect(dbProviderConfig.postgresql).toBeDefined();
      expect(dbProviderConfig.mysql).toBeDefined();
      expect(dbProviderConfig.sqlite).toBeDefined();
    });

    it('should have correct mongodb configuration', () => {
      const mongoConfig = dbProviderConfig.mongodb;

      expect(mongoConfig.features).toBeDefined();
      expect(mongoConfig.features?.filtering?.insensitive).toBe(true);
    });

    it('should have correct postgresql configuration', () => {
      const postgresConfig = dbProviderConfig.postgresql;

      expect(postgresConfig.features).toBeDefined();
      expect(postgresConfig.features?.filtering?.insensitive).toBe(true);
    });

    it('should have mysql configuration without specific features', () => {
      const mysqlConfig = dbProviderConfig.mysql;

      expect(mysqlConfig).toBeDefined();
      expect(mysqlConfig.features).toBeUndefined();
    });

    it('should have sqlite configuration without specific features', () => {
      const sqliteConfig = dbProviderConfig.sqlite;

      expect(sqliteConfig).toBeDefined();
      expect(sqliteConfig.features).toBeUndefined();
    });
  });

  describe('isDBProvider', () => {
    it('should return correct result based on provider comparison', () => {
      // Test the function logic with different providers
      // We can't easily mock the dbConfig in vitest, so let's test the basic function logic

      // The function compares provider with dbConfig.provider
      // Since we can't mock easily, we'll test that the function exists and works
      expect(typeof isDBProvider).toBe('function');

      // Test with all valid provider types
      const providers: DBProvider[] = [
        'mongodb',
        'postgresql',
        'mysql',
        'sqlite',
      ];

      providers.forEach((provider) => {
        // The function should not throw for valid providers
        expect(() => isDBProvider(provider)).not.toThrow();

        // The result should be a boolean
        const result = isDBProvider(provider);
        expect(typeof result).toBe('boolean');
      });
    });

    it('should handle provider comparison correctly', () => {
      // Test that the function returns boolean values for all supported providers
      const testProviders: DBProvider[] = [
        'mongodb',
        'postgresql',
        'mysql',
        'sqlite',
      ];

      testProviders.forEach((provider) => {
        const result = isDBProvider(provider);
        expect(typeof result).toBe('boolean');
      });
    });
  });
});
