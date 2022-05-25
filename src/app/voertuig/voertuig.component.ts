import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatastreamService} from '../datastream.service';
import { VoertuigDetailDialogComponent } from '../voertuig-detail-dialog/voertuig-detail-dialog.component';

@Component({
  selector: 'app-voertuig',
  templateUrl: './voertuig.component.html',
  styleUrls: ['./voertuig.component.css']
})
export class VoertuigComponent implements OnInit {

  entity: string = "voertuig";
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

  constructor(private datastream: DatastreamService, private dialog: MatDialog) {
    this.datastream.GetAllVehicles().subscribe((data) =>{
      this.voertuigen = data;
    });
  }


  ngOnInit(): void {

  }

  AddNewEntityDialog = () => {
    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      properties: this.properties,
      entity: this.entity
    };

    this.dialog.open(VoertuigDetailDialogComponent, config);
  }
}
