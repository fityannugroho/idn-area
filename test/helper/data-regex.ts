import { District, Island, Province, Regency, Village } from '@prisma/client';

type DataRegex<T extends Record<string | number | symbol, unknown>> = Partial<
  Record<keyof T, RegExp>
>;

export const provinceRegex = {
  code: /^\d{2}$/,
  name: /^(?![Pp][Rr][Oo][Vv][Ii][Nn][Ss][Ii]\b)[A-Z][a-z]+(?: [A-Z][a-z]+)*$/,
} as const satisfies DataRegex<Province>;

export const regencyRegex = {
  code: /^\d{2}\.\d{2}$/,
  name: /^(?:Kabupaten|Kota)(?: [A-Za-z]+(?:-[A-Za-z]+)*)+$/,
  provinceCode: provinceRegex.code,
} as const satisfies DataRegex<Regency>;

export const districtRegex = {
  code: /^\d{2}\.\d{2}\.\d{2}$/,
  name: /^[a-zA-Z0-9\-"'.\\/() ]+$/,
  regencyCode: regencyRegex.code,
} as const satisfies DataRegex<District>;

export const villageRegex = {
  code: /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/,
  name: /^(?!^".*"$)[A-Za-z0-9\-'"’.*\\/(), ]+$/,
  districtCode: districtRegex.code,
} as const satisfies DataRegex<Village>;

export const islandRegex = {
  code: /^\d{2}\.\d{2}\.4\d{4}$/,
  name: /^[a-zA-Z0-9\-'/’ ]+$/,
  coordinate:
    /^([0-8][0-9]|90)°([0-5][0-9])'([0-5][0-9]\.[0-9]{2})"\s(N|S)\s(0[0-9]{2}|1([0-7][0-9]|80))°([0-5][0-9])'([0-5][0-9]\.[0-9]{2})"\s(E|W)$/,
  regencyCode: /^\d{2}\.\d{2}|$/,
} as const satisfies DataRegex<Island>;
