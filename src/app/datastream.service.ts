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

  constructor( private http: HttpClient, @Inject("API_Url") _connectionstring: string) {
    this.connectionstring = _connectionstring;
  }

  GetAllVehicles = () => {
    return this.http.get(this.connectionstring +"voertuig/active");

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
