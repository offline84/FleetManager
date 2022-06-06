import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// De DatastreamService haalt de data op uit de databank van de API. Aangezien deze data async binnenkomt is het
// raadzaam gebruik te maken van subscribties (zie observer pattern, gang of four).

export class DatastreamService {

  private connectionstring: string;

  // Hier wordt de API- connectiestring geïnjecteerd d.m.v. de provider in ngModule. Indien men de
  // connectiestring naar de API wil veranderen dient deze ginds aangepast te worden.

  constructor(private http: HttpClient, @Inject("API_Url") _connectionstring: string) {
    this.connectionstring = _connectionstring;
  }

  //#region Voertuigen

  GetAllVehicles = () => {
    return this.http.get(this.connectionstring + "voertuig/active");
  }

  GetSingleVehicle = (vehicleId: string) => {
    return this.http.get(this.connectionstring + "voertuig/" + vehicleId);
  }

  GetStatusses = () => {
    return this.http.get(this.connectionstring + "voertuig/statusses");
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

  DeleteVehicle = (vehicleId: string) => {
    return this.http.delete(this.connectionstring + "voertuig/" + vehicleId);
  }
  //#endregion Voertuigen

  //#region Bestuurders

  GetDrivers = () => {
    return this.http.get(this.connectionstring + "bestuurder/active");
  }

  GetDriverLicences = () => {
    return this.http.get(this.connectionstring + "bestuurder/rijbewijzen");
  }

  GetSingleDriver = (rijksregisternummer: string) => {
    return this.http.get(this.connectionstring + "bestuurder/" + rijksregisternummer);
  }

  PostDriver = (bestuurder: any) => {
    return this.http.post(this.connectionstring + "bestuurder", bestuurder).pipe(catchError(this.handleError));
  }

  UpdateDriver = (bestuurder: any) => {
    return this.http.patch(this.connectionstring + "bestuurder", bestuurder).pipe(catchError(this.handleError));
  }
  //#endregion Bestuurders

  //#region Tankkaarten

  GetAllFuelCards = () => {
    return this.http.get(this.connectionstring + "tankkaart/active");
  }

  GetSingleFuelCard = (tankkaartId: string) => {
    return this.http.get(this.connectionstring + "tankkaart/" + tankkaartId);
  }

  PostFuelCard = (tankkaart: any) => {
    return this.http.post(this.connectionstring + "tankkaart", tankkaart).pipe(catchError(this.handleError));
  }

  UpdateFuelCard = (tankkaart: any) => {
    return this.http.patch(this.connectionstring + "tankkaart/update", tankkaart).pipe(catchError(this.handleError));
  }

  DeleteFuelCard = (tankkaartId: string) => {
    return this.http.delete(this.connectionstring + "tankkaart/delete/" + tankkaartId);
  }

  //#endregion Tankkaarten


  //#region Koppelingen

  UnlinkVehicle = (vehicleId: string) => {
    return this.http.get(this.connectionstring + "voertuig/koppellos/" + vehicleId).pipe(catchError(this.handleError));
  }

  LinkVehicle = (idNumber: string, vehicleId: string) => {
    return this.http.get(this.connectionstring + "voertuig/koppel/" + idNumber + "/" + vehicleId).pipe(catchError(this.handleError));
  }

  UnlinkFuelCard = (tankkaartId: string) => {
    return this.http.get(this.connectionstring + "voertuig/koppellos/" + tankkaartId).pipe(catchError(this.handleError));
  }

  LinkFuelCard = (idNumber: string, tankkaartId: string) => {
    return this.http.get(this.connectionstring + "voertuig/koppel/" + idNumber + "/" + tankkaartId).pipe(catchError(this.handleError));
  }

  //#endregion Koppelingen

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => error);
  }
}
