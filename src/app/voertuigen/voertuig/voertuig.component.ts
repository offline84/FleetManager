import { Component, Input, OnInit} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DatastreamService } from 'src/app/datastream.service';
import { DataExchangeService } from '../../data-exchange.service';
import { VoertuigDetailDialogComponent } from '../voertuig-detail-dialog/voertuig-detail-dialog.component';

@Component({
  selector: 'app-voertuig',
  templateUrl: './voertuig.component.html',
  styleUrls: ['./voertuig.component.css']
})
export class VoertuigComponent implements OnInit {

  @Input() entity: any;
  merken: any;

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

  constructor(private dialog: MatDialog, private dataService: DataExchangeService, private datastream: DatastreamService) {
  }

  ngOnInit(): void {
    this.datastream.GetAllVehicles().subscribe((data: any) => {

      var mapM = data.map((u: any) => u.merk) as string[];
      this.merken = [...new Set(mapM)];
      this.merken.sort();
    });
  }

  AddNewEntityDialog = () => {
    const config = new MatDialogConfig();

    config.autoFocus = true;

    config.data = {
      modifiable: true,
      entity: null,
      merken: this.merken
    };

    let dialogRef = this.dialog.open(VoertuigDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe(result => {
      this.entity = result;
      if(result !== undefined) {
        console.log(result);
        this.dataService.sendData("voertuig", "add", this.entity);
      }
    });
  }
}
