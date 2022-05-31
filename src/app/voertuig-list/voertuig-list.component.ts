import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DataExchangeService } from '../data-exchange.service';
import { DatastreamService } from '../datastream.service';
import { IVoertuig } from '../objects/iVoertuig';
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

  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private dialog: MatDialog) {}

  ngAfterViewInit() {

    this.datastream.GetAllVehicles().subscribe((data: any) =>{
      this.tableData = data;
      this.dataSource.data = this.tableData;
      this.dataSource.paginator = this.paging;
      this.dataSource.sort = this.sort;
    });

    console.log(this.tableData);
    console.log(this.dataSource);

    this.dataSource.sortingDataAccessor = (entity, property) => {
      switch(property){
        case 'status': return entity.status.staat;
        case 'brandstof': return entity.brandstof.typeBrandstof;
        case 'categorie' : return entity.categorie.typeWagen;
        case 'koppeling' : return entity.koppeling != null;
        default: return entity[property];
      }
    };
    this.dataService.observableData.subscribe((data: any) =>{
      console.log("sent data: ", data);
      if(data){
        if(data.type == "add voertuig"){
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

  //opent de voertuig-detail-dialog met settings voor viewing. bij het sluiten van de dialog wordt de data in de tabel bijgewerkt.
  ViewDetails = (selectedRow: IVoertuig) =>{
    const config = new MatDialogConfig();
    this.selectedVoertuig = selectedRow;

    config.autoFocus = true;
    config.data = {
      modifiable: false,
      entity: selectedRow
    };

    let dialogRef = this.dialog.open(VoertuigDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe((data: any) => {

      this.tableData.forEach((element, index) => {
        if(element.chassisnummer == data.chassisnummer) {
          this.tableData[index] = data;
        }
      });

      this.dataSource.data = this.tableData;
    })
  }




}


