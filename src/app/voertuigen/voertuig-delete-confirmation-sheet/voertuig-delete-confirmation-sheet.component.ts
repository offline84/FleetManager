import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DataExchangeService } from '../../data-exchange.service';
import { DatastreamService } from '../../datastream.service';
import { VoertuigDetailDialogComponent } from '../voertuig-detail-dialog/voertuig-detail-dialog.component';

@Component({
  selector: 'app-delete-confirmation-sheet',
  templateUrl: './voertuig-delete-confirmation-sheet.component.html',
  styleUrls: ['./voertuig-delete-confirmation-sheet.component.css']
})

/**
 * Dit component opent een bottom sheet die waarschuuwt bij de verwijdering van een voertuig dat deze bewerking onomkeerbaar is.
 * Men kan deze sheet niet sluiten, men dient een keuze te maken, vooraleer verder te gaan.
 */
export class DeleteConfirmationSheetComponent implements OnInit {

  /**
   * de te verwijderen entiteit.
   */
  entity: any;

  /**
   * het type tot welke deze entiteit behoort, in dit geval "voertuig"
   */
  entitytype: string;

  /**
   * In de constructor wordt de te verwijderen entiteit en het type van deze entiteit uit de binnengekomen data gehaald en opgeslagen in desbetreffende properties.
   *
   * @param datastream injecteert de datastream service in deze klasse.
   * @param dataService injecteert de data exchange service in deze klasse.
   * @param voertuigSheetRef referentie naar het geopende matbottomsheet in het voertuig detail dialog component
   * @param data de data die wordt meegegeven bij het openen van dit component.
   */
  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private voertuigSheetRef: MatBottomSheetRef<VoertuigDetailDialogComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any )
  {
    this.entity = data.entity;
    this.entitytype = data.entitytype;
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
  }

  /**
   * indien men wenst de entiteit niet te verwijderen wordt de bottom sheet enkel gesloten, zonder verdere acties te ondernemen.
   */
  onCancellation() {
    this.voertuigSheetRef.dismiss(false);
  }

  /**
   * indien men beslist de entiteit te verwijderen, wordt de entiteit en de eventuele koppeling verwijderd,
   * de entiteit wordt uit de tabel verwijderd via de data exchange service en een waarschuwingsbericht wordt weergegeven.
   */
  onConfirmationDelete() {
    this.datastream.DeleteVehicle(this.entity.chassisnummer).subscribe(null,
      (error) => {
        this.voertuigSheetRef.dismiss(error.message);
      },
      () => {
        this.dataService.sendData("voertuig", "delete", this.entity);
        this.voertuigSheetRef.dismiss(true);
        alert("Het voertuig is successvol verwijderd");
      }
    );
  }

}
