import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DataExchangeService } from '../data-exchange.service';
import { DatastreamService } from '../datastream.service';

@Component({
  selector: 'app-voertuig-list',
  templateUrl: './voertuig-list.component.html',
  styleUrls: ['./voertuig-list.component.css']
})
export class VoertuigListComponent implements AfterViewInit{

  tableData: Array<any> = new Array<any>();
  @Input() columnsToDisplay: any;
  @ViewChild(MatPaginator) paging!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private datastream: DatastreamService, private dataService: DataExchangeService) {}

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
      if(data.type == "voertuig")
        if(data.value){
          console.log("data reached tabledata because contains a value");
          this.tableData.push(data.value);
          this.dataSource.data = this.tableData;
        }
      console.log("data from dialog: ", data)
    });
  }

  FilterDataHandler(filter: any): void {
    this.dataSource = filter;
  }

  selectedVoertuig: any;



}


