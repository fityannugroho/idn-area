import { District, Island, Province, Regency, Village } from '@prisma/client';

type DataRegex<T extends Record<string | number | symbol, unknown>> = Partial<
  Record<keyof T, RegExp>
>;

export const provinceRegex: DataRegex<Province> = {
  code: /^\d{2}$/,
  name: /^(?!\s)(?!PROVINSI)[A-Z ]+$/,
};

export const regencyRegex: DataRegex<Regency> = {
  code: /^\d{4}$/,
  name: /^(?:KABUPATEN|KOTA)[A-Z ]+$/,
  provinceCode: provinceRegex.code,
};

export const districtRegex: DataRegex<District> = {
  code: /^\d{6}$/,
  name: /^[a-zA-Z0-9\-'.\\/() ]+$/,
  regencyCode: regencyRegex.code,
};

export const villageRegex: DataRegex<Village> = {
  code: /^\d{10}$/,
  name: /^[a-zA-Z0-9\-'"’.*\\/() ]+$/,
  districtCode: districtRegex.code,
};

export const islandRegex: DataRegex<Island> = {
  code: /^\d{9}$/,
  name: /^[a-zA-Z0-9\-'/ ]+$/,
  coordinate:
    /^([0-8][0-9]|90)°([0-5][0-9]|60)'(([0-5][0-9].[0-9]{2})|60.00)"\s(N|S)\s(0\d{2}|1([0-7][0-9]|80))°([0-5][0-9]|60)'(([0-5][0-9].[0-9]{2})|60.00)"\s(E|W)$/,
  regencyCode: /^\d{4}|$/,
};
