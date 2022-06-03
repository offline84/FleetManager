import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface dataToObserve{
  entity: string;
  action: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})

export class DataExchangeService {
  private dataToObserve: dataToObserve = {entity: "", action: "", value: null};
  private listOfData: Array<any> = [];

  private dataSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  observableData: Observable<dataToObserve> = this.dataSource.asObservable();

  constructor() { }

  sendData = (entity: string, action: string, data: any) => {
      this.dataToObserve.entity = entity;
      this.dataToObserve.action = action;
      this.dataToObserve.value = data;
      this.dataSource.next(this.dataToObserve);
  }
}
