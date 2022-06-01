import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatastreamService} from '../../datastream.service';
import {TankkaartDetailDialogComponent} from "../tankkaart-detail-dialog/tankkaart-detail-dialog.component";

@Component({
  selector: 'app-tankkaart',
  templateUrl: './tankkaart.component.html',
  styleUrls: ['./tankkaart.component.css']
})
export class TankkaartComponent implements OnInit {

  entity: string = "tankkaart";
  properties = [
    "kaartnummer",
    "geldigheidsdatum",
    "pincode",
    //"mogelijkebrandstoffen",
    "isGeblokkeerd",
    "koppeling"
  ];

  tankkaarten:any;

  constructor(private datastream: DatastreamService, private dialog: MatDialog) {
    this.datastream.GetAllFuelCards().subscribe((data) => {
      this.tankkaarten = data;
    })
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

    this.dialog.open(TankkaartDetailDialogComponent, config);
  }
}
