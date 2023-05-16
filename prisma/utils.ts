export type Province = {
  code: string;
  name: string;
};

export type Regency = {
  code: string;
  name: string;
  province_code: string;
};

export type District = {
  code: string;
  name: string;
  regency_code: string;
};

export type Village = {
  code: string;
  name: string;
  district_code: string;
};

export type Island = {
  code: string;
  name: string;
  regency_code: string;
  coordinate: string;
  is_populated: string;
  is_outermost_small: string;
};

export type Areas = Province | Regency | District | Village | Island;

export type Collection =
  | 'provinces'
  | 'regencies'
  | 'districts'
  | 'villages'
  | 'islands';

export type AreaByCollection<Collection> = Collection extends 'provinces'
  ? Province
  : Collection extends 'regencies'
  ? Regency
  : Collection extends 'districts'
  ? District
  : Collection extends 'villages'
  ? Village
  : Collection extends 'islands'
  ? Island
  : never;

export const isRegency = (area: Areas): area is Regency =>
  'province_code' in area;

export const isDistrict = (area: Areas): area is District =>
  'regency_code' in area && area.code.length === 6;

export const isVillage = (area: Areas): area is Village =>
  'district_code' in area;

export const isIsland = (area: Areas): area is Island =>
  'coordinate' in area &&
  'is_populated' in area &&
  'is_outermost_small' in area &&
  area.code.length === 9;
