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

export type Areas = Province | Regency | District | Village;

export type Collection = 'provinces' | 'regencies' | 'districts' | 'villages';

export type AreaByCollection<Collection> = Collection extends 'provinces'
  ? Province
  : Collection extends 'regencies'
  ? Regency
  : Collection extends 'districts'
  ? District
  : Collection extends 'villages'
  ? Village
  : never;

export const isRegency = (area: Areas): area is Regency =>
  'province_code' in area;

export const isDistrict = (area: Areas): area is District =>
  'regency_code' in area;

export const isVillage = (area: Areas): area is Village =>
  'district_code' in area;
