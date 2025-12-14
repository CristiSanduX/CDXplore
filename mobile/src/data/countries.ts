export type Country = {
  code: string;       // "RO"
  name: string;       // "Romania"
  continent: string;  // "Europe"
};

export const COUNTRIES: Country[] = [
  { code: "RO", name: "Romania", continent: "Europe" },
  { code: "AT", name: "Austria", continent: "Europe" },
  { code: "FR", name: "France", continent: "Europe" },
  { code: "DE", name: "Germany", continent: "Europe" },
  { code: "IT", name: "Italy", continent: "Europe" },
  { code: "ES", name: "Spain", continent: "Europe" },
  { code: "GB", name: "United Kingdom", continent: "Europe" },
  { code: "US", name: "United States", continent: "North America" },
  { code: "CA", name: "Canada", continent: "North America" },
  { code: "JP", name: "Japan", continent: "Asia" },
];
