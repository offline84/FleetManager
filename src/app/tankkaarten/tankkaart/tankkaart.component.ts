import {Component, Input, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatastreamService} from '../../datastream.service';
import {TankkaartDetailDialogComponent} from "../tankkaart-detail-dialog/tankkaart-detail-dialog.component";
import {DataExchangeService} from "../../data-exchange.service";
import {VoertuigDetailDialogComponent} from "../../voertuigen/voertuig-detail-dialog/voertuig-detail-dialog.component";

@Component({
  selector: 'app-tankkaart',
  templateUrl: './tankkaart.component.html',
  styleUrls: ['./tankkaart.component.css']
})
export class TankkaartComponent implements OnInit {

  @Input() entity: any;
  properties =  [
    "kaartnummer",
    "geldigheidsdatum",
    "pincode",
    //"mogelijkebrandstoffen",
    "isGeblokkeerd",
    "koppeling"
  ];

  constructor(private dialog: MatDialog, private dataService: DataExchangeService) {
  }

  ngOnInit(): void {
  }

  AddNewEntityDialog = () => {
    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      modifiable: true,
      entity: null
    };

    let dialogRef = this.dialog.open(TankkaartDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      this.entity = result;
      if(result !== undefined) {
        console.log(result);
        this.dataService.follow("add tankkaart");
        this.dataService.sendData("add tankkaart", this.entity);
      }
    });
  }
}
