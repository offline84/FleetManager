import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
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
export class BestuurderListComponent implements AfterViewInit{

  @Input() columnsToDisplay: any;
  @ViewChild(MatPaginator) paging!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  entityType: string = 'bestuurder';
  tableData: Array<any> = new Array<any>();
  selectedBestuurder: any;
  driverLicenses: IRijbewijs[] = [];

  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private dialog: MatDialog) {}

  ngAfterViewInit() {

this.datastream.GetDriverLicences().subscribe((licences: any) => {
  this.driverLicenses = licences;

this.datastream.GetDrivers().subscribe((data: any) =>{
  let dataString = "";
  let listDrivers: Array<any> = [];
  data.forEach((bestuurder: any) => {
  const listDriverLicenses: Array<any> = [];
  bestuurder.toewijzingenRijbewijs.forEach((rijbewijs: any) => {
    let driverLicense = this.driverLicenses.find(d=>d.id == rijbewijs.rijbewijsId);
    listDriverLicenses.push(driverLicense);

    if(driverLicense){
      dataString = dataString.concat(driverLicense.typeRijbewijs, ", ");
    }
  });

 bestuurder.rijbewijzen = listDriverLicenses;
 bestuurder.rijbewijs = dataString.slice(0,-2);
 listDrivers.push(bestuurder);
});
  this.tableData = listDrivers;
  this.dataSource.data = this.tableData;
  this.dataSource.paginator = this.paging;
  this.dataSource.sort = this.sort;
});
});

    console.log(this.tableData);
    console.log(this.dataSource);

    this.dataSource.sortingDataAccessor = (entity, property) => {
      switch(property){
         case 'rijbewijs': return entity.rijbewijs.typeRijbewijs;
        default: return entity[property];
      }
    };
    this.dataService.observableData.subscribe((data: any) =>{
      console.log("sent data: ", data);
      if(data){
        if(data.value){
          if(data.entity == "bestuurder"){
            if(data.action == "add"){
              if(data.value){
                this.tableData.unshift(data.value);

              }
            }

            if(data.action == "delete"){
              if(data.value){
                let index = this.tableData.findIndex(v=> v.rijksregisternummer == data.value.rijksregisternummer);
                this.tableData.splice(index, 1);
              }
            }

            this.dataSource.data = this.tableData;
          }
        }
      }
    });
  }

  FilterDataHandler(filter: any): void {
    this.dataSource = filter;
  }

  //opent de bestuurder-detail-dialog met settings voor viewing. bij het sluiten van de dialog wordt de data in de tabel bijgewerkt.
  ViewDetails = (selectedRow: IBestuurder) =>{
    const config = new MatDialogConfig();
    this.selectedBestuurder = selectedRow;

    config.autoFocus = true;
    config.data = {
      modifiable: false,
      entity: selectedRow
    };

    let dialogRef = this.dialog.open(BestuurderDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe((data: any) => {

      this.tableData.forEach((element, index) => {
        if(element.rijksregisternummer == data.rijksregisternummer) {
          this.tableData[index] = data;
        }
      });
      this.dataSource.data = this.tableData;
    })
  }
}


