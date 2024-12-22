import { Component, OnInit } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ConversionForStorage, HISTORY_STORAGE_KEY } from '../../models/currency.models';
import { HistoryService } from '../../services/history.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    MatCardModule],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  conversionHistory: ConversionForStorage[] = [];

  constructor(private historyService: HistoryService) { }

  ngOnInit() {
    this.initConversionFromLS();
  }

  initConversionFromLS() {
    this.conversionHistory = this.historyService.getDataFromStorage<ConversionForStorage>(HISTORY_STORAGE_KEY);
  }
}
