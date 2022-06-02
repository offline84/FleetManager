import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DataExchangeService } from '../../data-exchange.service';
import { DatastreamService } from '../../datastream.service';
import { IVoertuig } from '../../objects/iVoertuig';
import { VoertuigDetailDialogComponent } from '../voertuig-detail-dialog/voertuig-detail-dialog.component';

@Component({
  selector: 'app-voertuig-list',
  templateUrl: './voertuig-list.component.html',
  styleUrls: ['./voertuig-list.component.css']
})
export class VoertuigListComponent implements AfterViewInit{

  @Input() columnsToDisplay: any;
  @ViewChild(MatPaginator) paging!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  tableData: Array<any> = new Array<any>();
  selectedVoertuig: any;
  merken: any;

  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private dialog: MatDialog) {}

  ngAfterViewInit() {

    //data voor de tabel wordt binnengehaald en in tabelvorm gegoten.
    this.datastream.GetAllVehicles().subscribe((data: any) =>{
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
      switch(property){
        case 'status': return entity.status.staat;
        case 'brandstof': return entity.brandstof.typeBrandstof;
        case 'categorie' : return entity.categorie.typeWagen;
        case 'koppeling' : return entity.koppeling != null;
        default: return entity[property];
      }
    };

    // haalt de entiteit voor modificatie van de tabel binnen en kijkt welke bewerking op de tabel dient te worden uitgevoerd.
    // Hiervoor wordt gebruik gemaakt van de DataExchangeService.
    this.dataService.observableData.subscribe((data: any) =>{
      console.log("sent data: ", data);
      if(data){
        if(data.value){
          if(data.entity == "voertuig"){
            if(data.action == "add"){
              if(data.value){
                this.tableData.unshift(data.value);

              }
            }

            if(data.action == "delete"){
              if(data.value){
                let index = this.tableData.findIndex(v=> v.chassisnummer == data.value.chassisnummer);
                this.tableData.splice(index, 1);
              }
            }

            this.dataSource.data = this.tableData;
          }
        }
      }
    });
  }

  //behandelt de algemene filtering komend van de searchbar !!!IN PROGRESS!!!;
  FilterDataHandler(filter: any): void {
    this.dataSource = filter;
  }

  //opent de voertuig-detail-dialog met settings voor viewing.
  //Bij het sluiten van de dialog wordt de data in de tabel bijgewerkt via de dataexchangeservice.
  ViewDetails = (selectedRow: IVoertuig) =>{
    const config = new MatDialogConfig();
    this.selectedVoertuig = selectedRow;

    config.autoFocus = true;
    config.data = {
      modifiable: false,
      entity: selectedRow,
      merken: this.merken
    };

    let dialogRef = this.dialog.open(VoertuigDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe((data: any) => {

      if(data){
        this.tableData.forEach((element, index) => {
          if(element.chassisnummer == data.chassisnummer) {
            this.tableData[index] = data;
          }
        });

        this.dataSource.data = this.tableData;
      }
    });
  }




}


