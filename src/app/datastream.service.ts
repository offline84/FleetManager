import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatastreamService {

  connectionstring: string;
  configUrl = 'assets/config.json';

  constructor( private http: HttpClient) {
    this.connectionstring = "https://localhost:5001/"
    console.log(this.http.get(this.configUrl).subscribe((data: any) => data.urlToApi));
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
