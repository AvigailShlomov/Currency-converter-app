import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public getDataFromStorage<T>(key: string): T[] {
    /**@todo: 
     * verify the comments
     */
   // if (typeof localStorage !== 'undefined') { 
      const dataFromStorage = localStorage.getItem(key);
      
      if (dataFromStorage) {
        return (JSON.parse(dataFromStorage)) as T[];
      }
      else {
        return [];
        // console.log("Local Storage is not supported");
      }
//  }
    //return [];
  }

  public saveDataToStorage<T>(key: string, newConversion: T) {
    const data = this.getDataFromStorage(key);
    const newAndOldData = [newConversion, ...data];    
    localStorage.setItem(key, JSON.stringify(newAndOldData));    
  }
}
