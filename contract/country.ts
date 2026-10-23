export type CountryData = {
  /** ISO 3166-1 alpha-2, ie. 'DK' */
  Iso: string;
  NameUppercase: string;
  Name: string;
  /** ISO 3166-1 alpha-3, ie. 'DNK' */
  Iso3: string | null;
  /** ISO 3166-1 numeric */
  Numcode: number | null;
};

export interface CountryEndpoints {
  'GET /country': { res: CountryData[] };
}
