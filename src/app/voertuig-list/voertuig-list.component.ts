import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DatastreamService } from '../datastream.service';

@Component({
  selector: 'app-voertuig-list',
  templateUrl: './voertuig-list.component.html',
  styleUrls: ['./voertuig-list.component.css']
})
export class VoertuigListComponent implements AfterViewInit{

  @ViewChild(MatPaginator) paging!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private datastream: DatastreamService) {}

  ngAfterViewInit() {
    this.datastream.GetAllVehicles().subscribe((data: any) =>{
      this.dataSource.data = data;
      this.dataSource.paginator = this.paging;
      this.dataSource.sort = this.sort;
    });
    this.dataSource.sortingDataAccessor = (instance, property) => {
      switch(property){
        case 'status': return instance.status.staat;
        case 'brandstof': return instance.brandstof.typeBrandstof;
        case 'categorie' : return instance.categorie.typeWagen;
        case 'koppeling' : return instance.koppeling != null;
        default: return instance[property];
      }
    };
  }

  columnsToDisplay = [
    "chassisnummer",
    "merk",
    "model",
    "nummerplaat",
    "bouwjaar",
    "brandstof",
    "kleur",
    "aantalDeuren",
    "categorie",
    "status",
    "koppeling"
  ];

  selectedVoertuig: any;



}


