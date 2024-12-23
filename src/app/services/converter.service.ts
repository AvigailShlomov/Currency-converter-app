import { Injectable } from '@angular/core';
import { lastWeekDate } from '../utils/utils';
import { HttpClient } from '@angular/common/http';
import {
  BASE_API,
  ConverterResponse,
  Currencies,
  HistoricalRates,
} from '../models/currency.models';

@Injectable({
  providedIn: 'any',
})
export class ConverterService {
  private baseUrl = BASE_API;

  constructor(private http: HttpClient) { }

  getAllCurrencies() {
    return this.http.get<Currencies>(`${this.baseUrl}/currencies`);
  }

  public getConvertCurrency(from: string, to: string, amount: number) {
    return this.http.get<ConverterResponse>(
      `${this.baseUrl}/latest?amount=${amount}&base=${from}&symbols=${to}`
    );
  }

  public getHistoricalRates(fromCurr: string, toCurr: string) {
    const dateFrom = lastWeekDate();

    return this.http.get<HistoricalRates>(
      `${this.baseUrl}/${dateFrom}..?base=${fromCurr}&symbols=${toCurr}`
    );
  }
}
