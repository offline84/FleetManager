import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// De DatastreamService haalt de data op uit de databank van de API. Aangezien deze data async binnenkomt is het
// raadzaam gebruik te maken van subscribties (zie observer pattern, gang of four).

export class DatastreamService {

  connectionstring: string;

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
}
