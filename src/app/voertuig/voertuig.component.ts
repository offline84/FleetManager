import { Component, OnInit } from '@angular/core';
import { DatastreamService} from '../datastream.service';

@Component({
  selector: 'app-voertuig',
  templateUrl: './voertuig.component.html',
  styleUrls: ['./voertuig.component.css']
})
export class VoertuigComponent implements OnInit {

  properties = [
    "chassisnummer",
    "merk",
    "model",
    "nummerplaat",
    "bouwjaar",
    "brandstof",
    "kleur",
    "aantalDeuren",
    "categorie",
    "status",
    "koppeling"
  ];

  voertuigen: any;

  constructor(private datastream: DatastreamService) {
    this.datastream.GetAllVehicles().subscribe((data) =>{
      this.voertuigen = data;
    });
  }


  ngOnInit(): void {

  }

}
