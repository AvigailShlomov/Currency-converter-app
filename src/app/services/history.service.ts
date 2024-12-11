import { Injectable } from '@angular/core';
import { ConversionForStorage, STORAGE_KEY } from '../models/currency.models';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private stroage_key = STORAGE_KEY;
  private allStoredConversion: ConversionForStorage[] = [];


  public getConversionsFromStorage(): ConversionForStorage[] {
    if (typeof localStorage !== 'undefined') {
      const history = localStorage.getItem(this.stroage_key);
      if (history) {
        this.allStoredConversion = JSON.parse(history);
      }
      else {
        console.log("Local Storage is not supported");
      }
    }
    return this.allStoredConversion;
  }

  public saveConvertionToStorage(newConversion: ConversionForStorage) {
    const history = this.getConversionsFromStorage();
    const allConversions = [newConversion, ...history];
    localStorage.setItem(this.stroage_key, JSON.stringify(allConversions))
  }
}
