export interface Currencies { // export type Currencies= Record<string, string>;
  [key: string]: string;
}

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
      [currency: string]: number; // maybe record as well , but ill lose the currency 
    };
  };
}

export const BASE_API = 'https://api.frankfurter.dev/v1';
export const HISTORY_STORAGE_KEY = 'HistoryeKey';
export const CURRENCIES_STORAGE_KEY = 'CurrenciesKey';
