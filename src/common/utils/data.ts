import { District, Island, Province, Regency, Village } from '@prisma/client';
import { getData } from 'idn-area-data';

function removeDots(value: string): string {
  return value.replaceAll('.', '');
}

/**
 * Get customized provinces data.
 */
export function getProvinces() {
  return getData<Province>('provinces');
}

/**
 * Get customized regencies data.
 */
export function getRegencies() {
  return getData<Regency>('regencies', {
    transform: {
      headers: {
        province_code: 'provinceCode',
      },
      values: {
        code: removeDots,
        province_code: removeDots,
      },
    },
  });
}

/**
 * Get customized districts data.
 */
export function getDistricts() {
  return getData<District>('districts', {
    transform: {
      headers: {
        regency_code: 'regencyCode',
      },
      values: {
        code: removeDots,
        regency_code: removeDots,
      },
    },
  });
}

/**
 * Get customized villages data.
 */
export function getVillages() {
  return getData<Village>('villages', {
    transform: {
      headers: {
        district_code: 'districtCode',
      },
      values: {
        code: removeDots,
        district_code: removeDots,
      },
    },
  });
}

/**
 * Get customized islands data.
 */
export function getIslands() {
  return getData<Island>('islands', {
    transform: {
      headers: {
        is_outermost_small: 'isOutermostSmall',
        is_populated: 'isPopulated',
        regency_code: 'regencyCode',
      },
      values: {
        code: removeDots,
        regency_code: (value) => (value === '' ? null : removeDots(value)),
        is_outermost_small: (value) => !!parseInt(value, 10),
        is_populated: (value) => !!parseInt(value, 10),
      },
    },
  });
}
