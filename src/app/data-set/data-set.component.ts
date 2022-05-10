import { Component, OnInit } from '@angular/core';
import { Voertuig } from '../objects/voertuig';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-data-set',
  templateUrl: './data-set.component.html',
  styleUrls: ['./data-set.component.css']
})
export class DataSetComponent implements OnInit {

public voertuigen: any;
configUrl = 'assets/config.json';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

      console.log(this.http.get(this.configUrl).subscribe((data: any) => data.urlToApi));
  }

}
