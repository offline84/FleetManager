import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 *@ignore
 */
interface dataToObserve{
  entity: string;
  action: string;
  value: any;
}

@Injectable({
  providedIn: 'root'
})

export class DataExchangeService {

  /**
   * Dit Object vertelt waar en wat er dient gedaan te worden in de componenten, samen met de entiteit die daarvoor
   * dient gebruikt te worden.
   */
  private dataToObserve: dataToObserve = {entity: "", action: "", value: null};

  /**
   * Is het BehaviourSubject dat we gaan volgen met de Observable observableData.
   * Houdt veranderingen van het Object dataToObserve bij.
   *
   * Omdat we bij de start nog geen data willen meegeven als we de componenten initialiseren, geven we dit subject waarde null mee bij instantiëring.
   */
  private dataSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * Verwittigt ons wanneer er veranderingen worden aangebracht aan de property dataToObserve d.m.v. abonnering.
   */
  observableData: Observable<dataToObserve> = this.dataSource.asObservable();

  /**
   * Verzendt de data waarop men zich kan abonneren om deze te ontvangen.
   *
   * @param entity {string} de naam van de entiteit die men wil verzenden
   * @param action {string} de actie die uitgevoerd dient te worden op de entiteit.
   * @param data {any} de entiteit zelf.
   */
  sendData = (entity: string, action: string, data: any) => {
      this.dataToObserve.entity = entity;
      this.dataToObserve.action = action;
      this.dataToObserve.value = data;
      this.dataSource.next(this.dataToObserve);
  }
}
