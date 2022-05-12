import { Component, OnInit } from '@angular/core';
import { DatastreamService } from '../datastream.service';
import { Voertuig } from '../objects/voertuig';

@Component({
  selector: 'app-data-set',
  templateUrl: './data-set.component.html',
  styleUrls: ['./data-set.component.css']
})
export class DataSetComponent implements OnInit {

  voertuigen: any;


  constructor(private datastream: DatastreamService) {
    console.log(this.voertuigen);
  }

  ngOnInit(): void {
    this.datastream.GetAllVehicles().subscribe(vehicles => {
      this.voertuigen = vehicles;
      console.log(vehicles);
    });
  }

}
