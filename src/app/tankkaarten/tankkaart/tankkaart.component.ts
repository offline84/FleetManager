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

  /**
   * Bevat de tankkaart dat is aangemaakt.
   */
  @Input() entity: any;

  /**
   * Geeft al de te gebruiken columns van de tabel weer.
   * Wordt gebruikt in de htmlcode voor de aanmaak van de tabel.
   */
  properties =  [
    "kaartnummer",
    "geldigheidsdatum",
    "brandstoffenForView",
    "isGeblokkeerd",
    "koppeling"
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
   * Zorgt voor het openen van een dialoogvenster met de benodigde zaken voor het aanmaken van een nieuwe tankkaart.
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
