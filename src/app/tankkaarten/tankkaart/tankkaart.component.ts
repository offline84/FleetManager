import {Component, Input, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {TankkaartDetailDialogComponent} from "../tankkaart-detail-dialog/tankkaart-detail-dialog.component";
import {DataExchangeService} from "../../data-exchange.service";

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
    "brandstoffenForView",
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
        this.dataService.sendData("tankkaart","add", this.entity);
      }
    });
  }
}
