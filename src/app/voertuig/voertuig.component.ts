import { Component, Input, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DataExchangeService } from '../data-exchange.service';
import { DatastreamService} from '../datastream.service';
import { VoertuigDetailDialogComponent } from '../voertuig-detail-dialog/voertuig-detail-dialog.component';

@Component({
  selector: 'app-voertuig',
  templateUrl: './voertuig.component.html',
  styleUrls: ['./voertuig.component.css']
})
export class VoertuigComponent implements OnInit {

  @Input() entity: any;
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

  constructor(private dialog: MatDialog, private dataService: DataExchangeService) {
  }

  ngOnInit(): void {
  }

  AddNewEntityDialog = () => {
    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      mode: "add",
      entity: null
    };

    let dialogRef = this.dialog.open(VoertuigDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      this.entity = result;
      if(result !== undefined) {
        this.dataService.follow("voertuig");
        this.dataService.sendData("voertuig", this.entity);
      }
    });
  }
}
