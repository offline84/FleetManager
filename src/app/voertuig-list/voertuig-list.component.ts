import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { BehaviorSubject, observable } from 'rxjs';
import { DatastreamService } from '../datastream.service';

@Component({
  selector: 'app-voertuig-list',
  templateUrl: './voertuig-list.component.html',
  styleUrls: ['./voertuig-list.component.css']
})
export class VoertuigListComponent implements AfterViewInit{

  @Input() passedData: any;
  @Input() columnsToDisplay: any;
  @ViewChild(MatPaginator) paging!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private datastream: DatastreamService) {}

  ngAfterViewInit() {
    if(!this.passedData){
      this.datastream.GetAllVehicles().subscribe((data: any) =>{
        this.dataSource.data = data;
        this.dataSource.paginator = this.paging;
        this.dataSource.sort = this.sort;
      });
    }
    else{
      this.dataSource.data = this.passedData;
        this.dataSource.paginator = this.paging;
        this.dataSource.sort = this.sort;
    }

    this.dataSource.sortingDataAccessor = (entity, property) => {
      switch(property){
        case 'status': return entity.status.staat;
        case 'brandstof': return entity.brandstof.typeBrandstof;
        case 'categorie' : return entity.categorie.typeWagen;
        case 'koppeling' : return entity.koppeling != null;
        default: return entity[property];
      }
    };
    console.log(this.passedData.length);
    let changedPassedDataListener = new BehaviorSubject<any>(this.passedData);
  }

  FilterDataHandler(filter: any): void {
    this.dataSource = filter;
  }

  selectedVoertuig: any;



}


