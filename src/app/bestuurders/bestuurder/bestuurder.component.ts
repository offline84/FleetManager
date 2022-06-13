import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataExchangeService } from '../../data-exchange.service';
import { BestuurderDetailDialogComponent } from '../bestuurder-detail-dialog/bestuurder-detail-dialog.component';


@Component({
  selector: 'app-bestuurder',
  templateUrl: './bestuurder.component.html',
  styleUrls: ['./bestuurder.component.css']
})
export class BestuurderComponent implements OnInit {

  @Input() entity: any;
  properties = [
    "rijksregisternummer",
    "achternaam",
    "naam",
    "geboorteDatum",
    "adres",
    "rijbewijs",
    "koppelingVoertuig",
    "koppelingTankkaart"
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

    let dialogRef = this.dialog.open(BestuurderDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      this.entity = result;
      if(result !== undefined) {
        console.log(result);
        this.dataService.sendData("bestuurder", "add", this.entity);
      }
    });
  }
}
