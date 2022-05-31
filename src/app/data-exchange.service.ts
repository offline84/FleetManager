import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface dataToObserve{
  type: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})

export class DataExchangeService {
  private dataToObserve: dataToObserve = {type: "", value: null};
  private listOfData: Array<any> = [];

  private dataSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  observableData: Observable<dataToObserve> = this.dataSource.asObservable();

  constructor() { }

  follow = (typedescription: string) =>{
    if(this.listOfData.map(d => d.type).includes(typedescription)){
      this.dataToObserve = this.listOfData.find((o: any) => o.type === typedescription);
    }
    else{
      this.dataToObserve = {type: typedescription, value: null};
      this.listOfData.push(this.dataToObserve);
    }
  }

  sendData = (type: string, data: any) => {

    if(this.dataToObserve.type == type){
      this.dataToObserve.value = data;
      console.log(this.dataToObserve);
      this.dataSource.next(this.dataToObserve);
    }
  }
}
