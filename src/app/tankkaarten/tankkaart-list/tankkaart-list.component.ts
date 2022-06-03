import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DataExchangeService } from '../../data-exchange.service';
import { DatastreamService } from '../../datastream.service';
import {ITankkaart} from "../../objects/iTankkaart";
import {TankkaartDetailDialogComponent} from "../tankkaart-detail-dialog/tankkaart-detail-dialog.component";

@Component({
  selector: 'app-tankkaart-list',
  templateUrl: './tankkaart-list.component.html',
  styleUrls: ['./tankkaart-list.component.css']
})
export class TankkaartListComponent implements AfterViewInit {

  @Input() columnsToDisplay: any;
  @Input() entityType: string = 'tankkaart';
  @ViewChild(MatPaginator) paging!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  tableData: Array<any> = new Array<any>();
  selectedTankkaart: any;

  constructor(private datastream: DatastreamService, private dataService: DataExchangeService, private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.datastream.GetAllFuelCards().subscribe((data: any) =>{
      this.tableData = data;
      this.dataSource.data = this.tableData;
      this.dataSource.paginator = this.paging;
      this.dataSource.sort = this.sort;
    });

    console.log(this.tableData);
    console.log(this.dataSource);

    this.dataSource.sortingDataAccessor = (entity, property) => {
      switch(property){
        //case 'brandstof': return entity.brandstof.typeBrandstof;
        //case 'mogelijkebrandstoffen': return entity.mogelijkebrandstoffen.brandstof.typeBrandstof;
        case 'mogelijkebrandstoffen': return null;
        case 'koppeling' : return entity.koppeling != null;
        default: return entity[property];
      }
    };
    this.dataService.observableData.subscribe((data: any) =>{
      console.log("sent data: ", data);
      if(data){
        if(data.type == "add tankkaart"){
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

  //opent de tankkaart-detail-dialog met settings voor viewing. bij het sluiten van de dialog wordt de data in de tabel bijgewerkt.
  ViewDetails = (selectedRow: ITankkaart) =>{
    const config = new MatDialogConfig();
    this.selectedTankkaart = selectedRow;

    config.autoFocus = true;
    config.data = {
      modifiable: false,
      entity: selectedRow
    };

    let dialogRef = this.dialog.open(TankkaartDetailDialogComponent, config);

    dialogRef.afterClosed().subscribe((data: any) => {
      this.tableData.forEach((element, index) => {
        if(element.kaartnummer == data.kaartnummer) {
          this.tableData[index] = data;
        }
      });
      this.dataSource.data = this.tableData;
    })
  }
}
