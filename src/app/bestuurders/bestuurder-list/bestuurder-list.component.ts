import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
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

  tableData: Array<any> = new Array<any>();
  selectedBestuurder: any;

  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private dialog: MatDialog) {}

  ngAfterViewInit() {

    this.datastream.GetAllBestuurders().subscribe((data: any) =>{
      this.tableData = data;
      this.dataSource.data = this.tableData;
      this.dataSource.paginator = this.paging;
      this.dataSource.sort = this.sort;
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
        if(data.type == "add bestuurder"){
          if(data.value){
            console.log(this.tableData.length);
            this.tableData.push(data.value);
            console.log(this.tableData.length);
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


