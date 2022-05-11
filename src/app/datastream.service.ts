import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatastreamService {

  connectionstring: string;

  constructor( private http: HttpClient) {
    this.connectionstring = "https://localhost:5001/api/"
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
