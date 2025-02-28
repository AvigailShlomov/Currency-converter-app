import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ConverterService } from '../../services/converter.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { convertStringToDate } from '../../utils/utils';
import { Currencies, CURRENCIES_STORAGE_KEY, HISTORY_STORAGE_KEY } from '../../models/currency.models';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    CanvasJSAngularChartsModule,
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConverterComponent implements OnInit {
  amount: number = 1;
  fromCurrency: string = 'USD';
  toCurrency: string = 'ILS';
  result: number | null = null;
  currDisplay: { key: string; value: string }[] = [];
  chart: any;
  chartOptions: any;
  resultToCuur: string = 'ILS';
  resultFromCuur: string = 'USD';
  resultAmount: number = 1;

  constructor(
    private converterService: ConverterService,
    private historyService: LocalStorageService
  ) { }


  ngOnInit() {
    this.getAllCurrencies();
  }

  private getAllCurrencies() {
    const currenciesFromStorage = this.historyService.getDataFromStorage<Currencies>(CURRENCIES_STORAGE_KEY);
    if (currenciesFromStorage.length > 0) {

      this.currDisplay = currenciesFromStorage.flatMap(currencyObject =>
        Object.entries(currencyObject).map(([key, value]) => ({
          key,
          value
        }))
      );
    }
    else {// if the currencies doesn't exist in LS
      this.converterService.getAllCurrencies().subscribe({
        next: (currencies) => {
          this.currDisplay = Object.entries(currencies).map(([key, value]) => ({
            key,
            value,
          }));
          this.historyService.saveDataToStorage(CURRENCIES_STORAGE_KEY, currencies);
        },
        error: (err) => alert('Error while fetching currency List'),
      });
    }
  }

  convert() {
    if (this.amount <= 0) {
      console.log("Error! Amount is required when converting");
      return;
    }

    this.converterService
      .getConvertCurrency(this.fromCurrency, this.toCurrency, this.amount)
      .subscribe({
        next: (res) => {
          this.result = res.rates[this.toCurrency];
          this.historyService.saveDataToStorage(HISTORY_STORAGE_KEY,
            {
              amount: this.amount,
              from: this.fromCurrency,
              to: this.toCurrency,
              result: this.result,
              date: new Date(),
            });
          this.resultToCuur = this.toCurrency;
          this.resultFromCuur = this.fromCurrency;
          this.resultAmount = this.amount;
          this.updateChart();
        },
        error: (err) => alert('Error while fetching currency conversion'),
      });
  }

  private updateChart() {
    let chartXandYValues: { x: Date; y: number }[] = [];

    this.converterService.getHistoricalRates(this.fromCurrency, this.toCurrency)
      .subscribe({
        next: (data) => {
          const dates = Object.keys(data.rates);
          chartXandYValues = dates.map((date) => ({
            x: convertStringToDate(date),
            y: data.rates[date][this.toCurrency],
          }));

          this.initChartOptions(chartXandYValues);
          if (this.chart) {
            this.chart.render();
          }
        },
        error: (err) => console.error('Error fetching historical rates:', err),
      });
  }

  private initChartOptions(chartXandYValues: { x: Date; y: number }[]) {
    if (!this.chartOptions) {
      this.chartOptions = {
        theme: 'light2',
        animationEnabled: true,
        zoomEnabled: true,
        title: {
          text: `Exchange Rate`,
        },
        axisY: {
          labelFormatter: (e: any) => {
            const suffixes = ['', 'K', 'M', 'B', 'T'];
            let order = Math.max(
              Math.floor(Math.log(e.value) / Math.log(1000)),
              0
            );
            order = Math.min(order, suffixes.length - 1);
            const suffix = suffixes[order];
            return e.value / Math.pow(1000, order) + suffix;
          },
        },
        data: [
          {
            type: 'line',
            xValueFormatString: 'YYYY-MM-DD',
            yValueFormatString: '#,###.##',
            dataPoints: [...chartXandYValues],
          },
        ],
      };
    } else {
      this.chartOptions.data[0].dataPoints = [...chartXandYValues];
    }

  }
}
