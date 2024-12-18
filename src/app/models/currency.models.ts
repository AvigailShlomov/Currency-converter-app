export type Currencies= Record<string, string>;

export interface ConverterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ConversionForStorage {
  amount: number;
  from: string;
  to: string;
  result: number;
  date: Date;
}

export interface HistoricalRates {
  base: string;
  startDate: string;
  endDate: string;
  rates: {
    [key: string]: {
      [currency: string]: number;
    };
  };
}

export const BASE_API = 'https://api.frankfurter.dev/v1';
export const STORAGE_KEY = 'HistoryeKey';
