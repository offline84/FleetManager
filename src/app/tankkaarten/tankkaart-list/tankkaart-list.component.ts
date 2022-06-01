import {AfterViewInit, Input, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { DatastreamService } from '../../datastream.service';

@Component({
  selector: 'app-tankkaart-list',
  templateUrl: './tankkaart-list.component.html',
  styleUrls: ['./tankkaart-list.component.css']
})
export class TankkaartListComponent implements AfterViewInit {

  @Input() passedData: any;
  @Input() columnsToDisplay: any;
  @ViewChild(MatPaginator) paging!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private datastream: DatastreamService) {}

  ngAfterViewInit() {
    if(!this.passedData){
      this.datastream.GetAllFuelCards().subscribe((data: any) =>{
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
        //case 'brandstof': return entity.brandstof.typeBrandstof;
        //case 'mogelijkebrandstoffen': return entity.mogelijkebrandstoffen.brandstof.typeBrandstof;
        case 'mogelijkebrandstoffen': return null;
        case 'koppeling' : return entity.koppeling != null;
        default: return entity[property];
      }
    };
  }
  FilterDataHandler(filter: any): void {
    this.dataSource = filter;
  }
  selectedTankkaart: any;
}
