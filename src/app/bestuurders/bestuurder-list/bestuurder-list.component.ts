import { AfterViewInit, Input, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { IRijbewijs } from 'src/app/objects/iRijbewijs';
import { DataExchangeService } from '../../data-exchange.service';
import { DatastreamService } from '../../datastream.service';
import { IBestuurder } from '../../objects/iBestuurder';
import { BestuurderDetailDialogComponent } from '../bestuurder-detail-dialog/bestuurder-detail-dialog.component';

@Component({
  selector: 'app-bestuurder-list',
  templateUrl: './bestuurder-list.component.html',
  styleUrls: ['./bestuurder-list.component.css']
})
export class BestuurderListComponent implements AfterViewInit {

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
   * Bevat het te behandelen dataType, in dit geval: bestuurder.
   */
  entityType: string = 'bestuurder';

   /**
   * Bevat de te manipuleren data voor de tabel.
   * wordt opgehaald via de datastreamservice.
   */
  tableData: Array<any> = new Array<any>();

    /**
   * Bevat het bestuurder dat geselecteerd wordt uit de tabel.
   */
  selectedBestuurder: any;

     /**
   * Omvat alle geseede rijbewijzen uit de database.
   * wordt opgevuld tijdens OnInit.
   */
  driverLicenses: IRijbewijs[] = [];

/**
   *
   * @param datastream injecteert de datastream service in deze klasse.
   * @param dataService injecteert de data exchange service in deze klasse.
   * @param dialog maakt een instantie van het dialoogvenster aan.
   */
  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private dialog: MatDialog) { }

  ngAfterViewInit() {

     //data voor rijbewijzen wordt binnengehaald en in lijstvorm gegoten.
    this.datastream.GetDriverLicences().subscribe((licences: any) => {
      this.driverLicenses = licences;

           //data voor de tabel wordt binnengehaald en in tabelvorm gegoten.
      this.datastream.GetAllDrivers().subscribe((bestuurders: any) => {
        let listDrivers: Array<any> = [];
        if (bestuurders) {
          bestuurders.forEach((bestuurder: any) => {
            let dataString = "";
            bestuurder.toewijzingenRijbewijs.forEach((rijbewijs: any) => {
              let driverLicense = this.driverLicenses.find(d => d.id == rijbewijs.rijbewijsId);
              if (driverLicense) {
                dataString = dataString.concat(driverLicense.typeRijbewijs, ", ");
              }
            });
            bestuurder.rijbewijzen = this.driverLicenses;
            bestuurder.rijbewijs = dataString.slice(0, -2);
            if (bestuurder.adres.huisnummer == 0 && bestuurder.adres.postcode == 0) {
              bestuurder.adres.adresForView = "";
            } else {
              bestuurder.adres.adresForView = bestuurder.adres.straat + " " + bestuurder.adres.huisnummer + ", " + bestuurder.adres.postcode + " " + bestuurder.adres.stad;
            }
            listDrivers.push(bestuurder);
          });
        }
        this.tableData = listDrivers;
        this.dataSource.data = this.tableData;
        this.dataSource.paginator = this.paging;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'adresForView': return item.adres.adresForView;
            default: return item[property];
          }
        };
      });
    });

     //Customizing voor sorteren van kolommen die voortkomen uit een object.
    this.dataSource.sortingDataAccessor = (entity, property) => {
      switch (property) {
        case 'rijbewijs': return entity.rijbewijs.typeRijbewijs;
        case 'geboorteDatum': return entity.geboorteDatum;

        default: return entity[property];
      }
    };

    // haalt de entiteit voor modificatie van de tabel binnen en kijkt welke bewerking op de tabel dient te worden uitgevoerd.
    // Hiervoor wordt gebruik gemaakt van de DataExchangeService.
    this.dataService.observableData.subscribe((data: any) => {
      if (data) {
        if (data.value) {
          if (data.entity == "bestuurder") {
            if (data.action == "add") {
              if (data.value) {
                this.tableData.unshift(data.value);
              }
            }

            if (data.action == "delete") {
              if (data.value) {
                let index = this.tableData.findIndex(v => v.rijksregisternummer == data.value.rijksregisternummer);
                this.tableData.splice(index, 1);
              }
            }
            if(data.action == "view"){
              if(data.value){
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
   * opent de bestuurder-detail-dialog met settings voor viewing.
   * Eerst wordt het dialoogvenster geconfigureerd,
   * daarna wordt de entiteit en de modus, alsook de tabel met automerken meegegeven.
   * Bij het sluiten van de dialog wordt de data in de tabel bijgewerkt.
   *
   * @param selectedRow de geselecteerde rij uit de tabel.
   */
  ViewDetails = (selectedRow: IBestuurder) => {
    const config = new MatDialogConfig();
    this.selectedBestuurder = selectedRow;

    this.datastream.GetSingleVehicle(this.selectedBestuurder.koppeling.chassisnummer).subscribe((vehicle: any) => {
      this.datastream.GetSingleFuelCard(this.selectedBestuurder.koppeling.kaartnummer).subscribe((card: any) => {
        config.autoFocus = true;
        config.data = {
          modifiable: false,
          entity: selectedRow,
          voertuigLink: vehicle,
          tankkaartLink: card
        };

        let dialogRef = this.dialog.open(BestuurderDetailDialogComponent, config);

        dialogRef.afterClosed().subscribe((data: any) => {

          this.tableData.forEach((element, index) => {
            if (data != undefined && element.rijksregisternummer == data.rijksregisternummer) {
              this.tableData[index] = data;
            }
          });

          this.dataSource.data = this.tableData;
        })
      });
    });
  }
}


