/**
 * Test Data Fixtures
 *
 * Factory functions to create consistent and reusable test data.
 * Using factory pattern for flexibility in creating test data.
 */

import { District } from '@/district/district.dto';
import { Island } from '@/island/island.dto';
import { Province } from '@/province/province.dto';
import { Regency } from '@/regency/regency.dto';
import { Village } from '@/village/village.dto';

/**
 * Creates a mock Province with optional overrides
 */
export const createMockProvince = (
  overrides: Partial<Province> = {},
): Province => ({
  code: '32',
  name: 'Jawa Barat',
  ...overrides,
});

/**
 * Creates a mock Regency with optional overrides
 */
export const createMockRegency = (
  overrides: Partial<Regency> = {},
): Regency => ({
  code: '32.01',
  name: 'Kabupaten Bogor',
  provinceCode: '32',
  ...overrides,
});

/**
 * Creates a mock District with optional overrides
 */
export const createMockDistrict = (
  overrides: Partial<District> = {},
): District => ({
  code: '32.01.01',
  name: 'Nanggung',
  regencyCode: '32.01',
  ...overrides,
});

/**
 * Creates a mock Village with optional overrides
 */
export const createMockVillage = (
  overrides: Partial<Village> = {},
): Village => ({
  code: '32.01.01.2001',
  name: 'Bantarjati',
  districtCode: '32.01.01',
  ...overrides,
});

/**
 * Creates a mock Island with optional overrides
 */
export const createMockIsland = (overrides: Partial<Island> = {}): Island => ({
  code: '32.01.40001',
  name: 'Pulau Rambut',
  coordinate: '06°10\'30.00" S 106°38\'30.00" E',
  isOutermostSmall: false,
  isPopulated: false,
  regencyCode: '32.01',
  latitude: -6.175,
  longitude: 106.827,
  ...overrides,
});

/**
 * Pre-defined test data sets untuk common test scenarios
 */
export const mockTestData = {
  // Java provinces
  javaProvinces: [
    createMockProvince({ code: '32', name: 'Jawa Barat' }),
    createMockProvince({ code: '33', name: 'Jawa Tengah' }),
    createMockProvince({ code: '34', name: 'Daerah Istimewa Yogyakarta' }),
    createMockProvince({ code: '35', name: 'Jawa Timur' }),
  ],

  // Sumatra provinces
  sumatraProvinces: [
    createMockProvince({ code: '11', name: 'Aceh' }),
    createMockProvince({ code: '12', name: 'Sumatera Utara' }),
    createMockProvince({ code: '13', name: 'Sumatera Barat' }),
  ],

  // West Java regencies
  westJavaRegencies: [
    createMockRegency({
      code: '32.01',
      name: 'Kabupaten Bogor',
      provinceCode: '32',
    }),
    createMockRegency({
      code: '32.02',
      name: 'Kabupaten Sukabumi',
      provinceCode: '32',
    }),
    createMockRegency({
      code: '32.71',
      name: 'Kota Bogor',
      provinceCode: '32',
    }),
  ],

  // Bogor districts
  bogorDistricts: [
    createMockDistrict({
      code: '32.01.01',
      name: 'Nanggung',
      regencyCode: '32.01',
    }),
    createMockDistrict({
      code: '32.01.02',
      name: 'LEUWILIANG',
      regencyCode: '32.01',
    }),
    createMockDistrict({
      code: '32.01.03',
      name: 'Leuwisadeng',
      regencyCode: '32.01',
    }),
  ],

  // Sample villages
  sampleVillages: [
    createMockVillage({
      code: '32.01.01.2001',
      name: 'Bantarjati',
      districtCode: '32.01.01',
    }),
    createMockVillage({
      code: '32.01.01.2002',
      name: 'Curugbitung',
      districtCode: '32.01.01',
    }),
  ],

  // Sample islands
  sampleIslands: [
    createMockIsland({
      code: '32.01.40001',
      name: 'Pulau Rambut',
      regencyCode: '32.01',
      coordinate: '06°10\'30.00" S 106°38\'30.00" E',
      isPopulated: false,
      latitude: -6.175000000000001,
      longitude: 106.64166666666668,
    }),
    createMockIsland({
      code: '32.02.40001',
      name: 'Pulau Handeuleum',
      regencyCode: '32.02',
      coordinate: '06°45\'15.00" S 106°20\'45.00" E',
      isPopulated: true,
      latitude: -6.754166666666666,
      longitude: 106.34583333333333,
    }),
    createMockIsland({
      code: '32.00.40001',
      name: 'Pulau Damar',
      regencyCode: null,
      coordinate: '06°15\'20.00" S 106°42\'10.00" E',
      isPopulated: false,
      latitude: -6.2555555555555555,
      longitude: 106.70277777777778,
    }),
  ],
};

/**
 * Helper function to create hierarchical test data
 */
export const createHierarchicalData = () => {
  const province = createMockProvince({ code: '32', name: 'Jawa Barat' });
  const regency = createMockRegency({
    code: '32.01',
    name: 'Kabupaten Bogor',
    provinceCode: province.code,
  });
  const district = createMockDistrict({
    code: '32.01.01',
    name: 'Nanggung',
    regencyCode: regency.code,
  });
  const village = createMockVillage({
    code: '32.01.01.2001',
    name: 'Bantarjati',
    districtCode: district.code,
  });

  return { province, regency, district, village };
};

/**
 * Helper function to create data for pagination testing
 */
export const createPaginationTestData = (count: number, prefix = 'ITEM') => {
  return Array.from({ length: count }, (_, i) =>
    createMockProvince({
      code: String(i + 1).padStart(2, '0'),
      name: `${prefix} ${i + 1}`,
    }),
  );
};
