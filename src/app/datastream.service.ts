import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


/**
 * De DatastreamService haalt de data op uit de databank van de API. Aangezien deze data async binnenkomt is het
 * raadzaam gebruik te maken van abonnementen (zie observer pattern, gang of four).
 */
export class DatastreamService {

  /**
   * bevat de connectiestring naar de API. Wordt geïnitialiseerd via de constructor.
   */
  private connectionstring: string;

  // Hier wordt de API- connectiestring geïnjecteerd d.m.v. de provider in ngModule. Indien men de
  // connectiestring naar de API wil veranderen dient deze ginds aangepast te worden.
  /**
   *
   * @param http  verzorgt de crud operaties naar de API toe.
   * @param _connectionstring Wordt geïnjecteerd via de provider in app.module.ts en bevat de connectiestring naar de API.
   */
  constructor( private http: HttpClient, @Inject("API_Url") _connectionstring: string) {
    this.connectionstring = _connectionstring;
  }

  //#region Voertuigen

  GetAllVehicles = () => {
    return this.http.get(this.connectionstring +"voertuig/active");
  }

  GetSingleVehicle = (vehicleId: string) => {
    return this.http.get(this.connectionstring +"voertuig/" + vehicleId);
  }

  GetStatusses = () => {
    return this.http.get(this.connectionstring +"voertuig/statusses");
  }

  GetCategories = () => {
    return this.http.get(this.connectionstring + "voertuig/categories");
  }

  GetFuels = () => {
    return this.http.get(this.connectionstring + "voertuig/brandstoffen");
  }

  PostVehicle = (voertuig: any) => {
    return this.http.post(this.connectionstring + "voertuig", voertuig).pipe(catchError(this.handleError));
  }

  UpdateVehicle = (voertuig: any) => {
    return this.http.patch(this.connectionstring + "voertuig/update", voertuig).pipe(catchError(this.handleError));
  }

  DeleteVehicle = (vehicleId: string) =>{
    return this.http.delete(this.connectionstring +"voertuig/" + vehicleId);
  }
  //#endregion Voertuigen

  //#region Bestuurders
  GetAllBestuurders = () => {
    return this.http.get(this.connectionstring + "bestuurder/activebestuurders");
  }
  //#endregion Bestuurders
  //#region Tankkaarten

  GetAllFuelCards = () => {
    return this.http.get(this.connectionstring +"tankkaart/active");
  }

  GetSingleFuelCard = (tankkaartId: string) => {
    return this.http.get(this.connectionstring +"tankkaart/" + tankkaartId);
  }

  PostFuelCard = (tankkaart: any) => {
    return this.http.post(this.connectionstring + "tankkaart", tankkaart).pipe(catchError(this.handleError));
  }

  //#endregion Tankkaarten

  UpdateFuelCard  = (tankkaart: any) => {
    return this.http.patch(this.connectionstring + "tankkaart/update", tankkaart).pipe(catchError(this.handleError));
  }

  DeleteFuelCard  = (tankkaartId: string) =>{
    return this.http.delete(this.connectionstring +"tankkaart/delete/" + tankkaartId);
  }

  //#endregion Tankkaarten


  //#region Koppelingen

  UnlinkVehicle = (vehicleId: string) => {
    return this.http.get(this.connectionstring + "voertuig/koppellos/" + vehicleId).pipe(catchError(this.handleError));
  }

  LinkVehicle = ( idNumber: string, vehicleId: string) => {
    return this.http.get(this.connectionstring + "voertuig/koppel/" + idNumber + "/" + vehicleId).pipe(catchError(this.handleError));
  }

  UnlinkFuelCard = (tankkaartId: string) => {
    return this.http.get(this.connectionstring + "tankkaart/koppellos/" + tankkaartId).pipe(catchError(this.handleError));
  }

  LinkFuelCard = ( idNumber: string, tankkaartId: string) => {
    return this.http.get(this.connectionstring + "tankkaart/koppel/" + idNumber + "/" + tankkaartId).pipe(catchError(this.handleError));
  }

  //#endregion Koppelingen


  /**
   * Zorgt ervoor dat de error zichtbaar is in de logfiles.
   *
   * @example
   * if (error.status === 0) {
   *  console.error('An error occurred:', error.error);       => client side error
   *
   * @example
   * else {
   *  console.error(
   *     `Backend returned code ${error.status}, body was: `, error.error);       => server side error
   * }
   *
   * @example
   * return throwError(() => error);          => error with response body
   *
   * @param error is de HttpErrorResponse die bij fout in verzending meegegeven wordt aan de HttpResponse.
   * @returns Observable van de error voor admin gerichte berichten.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {

      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => error);
  }
}
