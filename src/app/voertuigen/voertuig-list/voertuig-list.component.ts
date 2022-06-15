import { AfterViewInit, Input, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataExchangeService } from '../../data-exchange.service';
import { DatastreamService } from '../../datastream.service';
import { IVoertuig } from '../../objects/iVoertuig';
import { VoertuigDetailDialogComponent } from '../voertuig-detail-dialog/voertuig-detail-dialog.component';

@Component({
  selector: 'app-voertuig-list',
  templateUrl: './voertuig-list.component.html',
  styleUrls: ['./voertuig-list.component.css']
})
export class VoertuigListComponent implements AfterViewInit {

  /**
   * Geeft al de te gebruiken columns van de tabel weer.
   * Wordt gebruikt in de htmlcode voor de aanmaak van de tabel.
   */
  @Input() columnsToDisplay: any;

  /**
   * behandelt de paginaindeling in de htmlcode voor de tabel.
   * deze set de initiele waarde van het aantal rijen, bevat de verschillende opties voor de weergave van aantal rijen
   * en het totale aantal van rijen die gebruikt worden voor paginatie.
   */
  @ViewChild(MatPaginator) paging!: MatPaginator;

  /**
   * behandelt de sortering per kolom in de htmlcode voor de tabel.
   */
  @ViewChild(MatSort) sort!: MatSort;

  /**
   * deze property behandelt alles van de tabel.
   * Ze bevat de data, filters, paginatie, sortering, ... .
   */
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  /**
   * Deze property verzorgt de correcte behandeling van inkomende data via de data exchange service.
   * Bevat het te behandelen dataType, in dit geval: voertuig.
   */
  entityType: string = 'voertuig';

  /**
   * Bevat de te manipuleren data voor de tabel.
   * wordt opgehaald via de datastreamservice.
   */
  tableData: Array<any> = new Array<any>();

  /**
   * Bevat het voertuig dat geselecteerd wordt uit de tabel.
   */
  selectedVoertuig: any;

  /**
   * Omvat de lijst van automerken die reeds in de database zijn opgenomen.
   * wordt tegelijkertijd opgehaald met de tableData.
   */
  merken: any;

  /**
   *
   * @param datastream injecteert de datastream service in deze klasse.
   * @param dataService injecteert de data exchange service in deze klasse.
   * @param dialog maakt een instantie van het dialoogvenster aan.
   */
  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private dialog: MatDialog) { }

  ngAfterViewInit() {

    //data voor de tabel wordt binnengehaald en in tabelvorm gegoten.
    this.datastream.GetAllVehicles().subscribe((data: any) => {
      this.tableData = data;
      this.dataSource.data = this.tableData;
      this.dataSource.paginator = this.paging;
      this.dataSource.sort = this.sort;

      //hier worden de autocomlete merken opgehaald voor de modifiable dialog
      var mapM = data.map((u: any) => u.merk) as string[];
      this.merken = [...new Set(mapM)];
      this.merken.sort();
    });

    //Customizing voor sorteren van kolommen die voortkomen uit een object.
    this.dataSource.sortingDataAccessor = (entity, property) => {
      switch (property) {
        case 'status': return entity.status.staat;
        case 'brandstof': return entity.brandstof.typeBrandstof;
        case 'categorie': return entity.categorie.typeWagen;
        case 'koppeling': return entity.koppeling != null;
        default: return entity[property];
      }
    };

    // haalt de entiteit voor modificatie van de tabel binnen en kijkt welke bewerking op de tabel dient te worden uitgevoerd.
    // Hiervoor wordt gebruik gemaakt van de DataExchangeService.
    this.dataService.observableData.subscribe((data: any) => {
      console.log("sent data: ", data);
      if (data) {
        if (data.value) {
          if (data.entity == this.entityType) {
            if (data.action == "add") {
              if (data.value) {
                this.tableData.unshift(data.value);

              }
            }

            if (data.action == "delete") {
              if (data.value) {
                let index = this.tableData.findIndex(v => v.chassisnummer == data.value.chassisnummer);
                this.tableData.splice(index, 1);
              }
            }
            if (data.action == "view") {
              if (data.value) {
                this.ViewDetails(data.value);
              }
            }

            this.dataSource.data = this.tableData;
          }
        }
      }
    });
  }

  /**
   * set de filter komende van de searchbar component.
   * @param filter {string} de te filteren query.
   */
  FilterDataHandler(filter: any): void {
    this.dataSource = filter;
  }


  /**
   * opent de voertuig-detail-dialog met settings voor viewing.
   * Eerst wordt het dialoogvenster geconfigureerd,
   * daarna wordt de entiteit en de modus, alsook de tabel met automerken meegegeven.
   * Bij het sluiten van de dialog wordt de data in de tabel bijgewerkt.
   *
   * @param selectedRow de geselecteerde rij uit de tabel.
   */
  ViewDetails = (selectedRow: IVoertuig) => {

    const config = new MatDialogConfig();
    this.selectedVoertuig = selectedRow;
    var dialogRef;

    if (this.selectedVoertuig.koppeling) {
      this.datastream.GetSingleDriver(this.selectedVoertuig.koppeling.rijksregisternummer).subscribe((data: any) => {

        config.autoFocus = true;
        config.data = {
          modifiable: false,
          entity: selectedRow,
          merken: this.merken,
          bestuurderLink: data
        };
        dialogRef = this.dialog.open(VoertuigDetailDialogComponent, config);

        dialogRef.afterClosed().subscribe((data: any) => {

          if (data) {
            this.tableData.forEach((element, index) => {
              if (element.chassisnummer == data.chassisnummer) {
                this.tableData[index] = data;
              }
            });

            this.dataSource.data = this.tableData;
          }
        });
      });
    }
    else{
      config.autoFocus = true;
        config.data = {
          modifiable: false,
          entity: selectedRow,
          merken: this.merken
        };

        dialogRef = this.dialog.open(VoertuigDetailDialogComponent, config);

        dialogRef.afterClosed().subscribe((data: any) => {

          if (data) {
            this.tableData.forEach((element, index) => {
              if (element.chassisnummer == data.chassisnummer) {
                this.tableData[index] = data;
              }
            });

            this.dataSource.data = this.tableData;
          }
        });
    }
  }
}


