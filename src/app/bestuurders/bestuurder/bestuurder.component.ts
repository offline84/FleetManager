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

    /**
   * Bevat het voertuig dat is aangemaakt.
   */
  @Input() entity: any;

    /**
    * Geeft al de te gebruiken columns van de tabel weer.
    * Wordt gebruikt in de htmlcode voor de aanmaak van de tabel.
    */
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

   /**
   *
   * @param dataService injecteert de data exchange service in deze klasse.
   * @param dialog maakt een instantie van het dialoogvenster aan.
   */
  constructor(private dialog: MatDialog, private dataService: DataExchangeService) {
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

  /**
   * Zorgt voor het openen van een dialoogvenster met de benodigde zaken voor het aanmaken van een nieuwe bestuurder.
   * Eerst wordt het dialoogvenster geconfigureerd, daarna wordt de entiteit en de modus meegegeven.
   * Bij het sluiten van de dialog wordt de data in de tabel bijgewerkt a.d.h.v. de data exchange service.
   */
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
