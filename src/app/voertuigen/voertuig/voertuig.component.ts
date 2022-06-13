import { Component, Input, OnInit } from '@angular/core';
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

  /**
   * Bevat het voertuig dat is aangemaakt.
   */
  @Input() entity: any;


  /**
   * Bevat de lijst van automerken die reeds in de database voorkomen.
   * deze lijst wordt geïnstantieerd onInit en dient voor de autocomplete bij aanmaak van een nieuw voertuig.
   */
  merken: any;

  /**
    * Geeft al de te gebruiken columns van de tabel weer.
    * Wordt gebruikt in de htmlcode voor de aanmaak van de tabel.
    */
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

  /**
   *
   * @param datastream injecteert de datastream service in deze klasse.
   * @param dataService injecteert de data exchange service in deze klasse.
   * @param dialog maakt een instantie van het dialoogvenster aan.
   */
  constructor(private dialog: MatDialog, private dataService: DataExchangeService, private datastream: DatastreamService) {
  }

  /**
   * Bij initialisatie van dit component wordt de lijst van automerken gegenereerd en gesorteerd.
   */
  ngOnInit(): void {
    this.datastream.GetAllVehicles().subscribe((data: any) => {

      var mapM = data.map((u: any) => u.merk) as string[];
      this.merken = [...new Set(mapM)];
      this.merken.sort();
    });
  }

  /**
   * Zorgt voor het openen van een dialoogvenster met de benodigde zaken voor het aanmaken van een nieuw voertuig.
   * Eerst wordt het dialoogvenster geconfigureerd,
   * daarna wordt de entiteit en de modus, alsook de tabel met automerken meegegeven.
   * Bij het sluiten van de dialog wordt de data in de tabel bijgewerkt a.d.h.v. de data exchange service.
   */
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
      if (result !== undefined) {
        console.log(result);
        this.dataService.sendData("voertuig", "add", this.entity);
      }
    });
  }
}
