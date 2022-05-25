import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IVoertuig } from '../objects/iVoertuig';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Output("dataSource") passFilteredData: EventEmitter<any> = new EventEmitter();
  @Input() properties: any;
  @Input() dataToFilter: any;
  search: string = "";
  selected: string = "";
  voertuig: any;


  constructor() {}

  ngOnInit(): void {

  }

  FilterResults = () => {
    let property: string;
    let filterArray: any;
    let dataSource: MatTableDataSource<any> = new MatTableDataSource();


    //TO DO make filters work for nested objects.

    if(this.selected == 'status'){
      filterArray = this.dataToFilter.data;
      dataSource.data = this.dataToFilter.data.filter((v: IVoertuig) => v.status.staat.includes(this.search));
      console.log(dataSource.data);
      this.passFilteredData.emit(dataSource.filter == this.search);
    }

    if(this.selected == 'brandstof'){
      filterArray = this.dataToFilter.filteredData;
      filterArray = filterArray.filter((v: any) => v.brandstof.typeBrandstof).includes(this.search);
      console.log(filterArray);

      dataSource.data = filterArray;
      console.log(filterArray);
      console.log(dataSource.data);
    }
    let categorie;
    if(this.selected == 'categorie'){
      this.dataToFilter.filterpredicate = (data: any, filter: string) => {
        return data.map((v: IVoertuig) => v.categorie.typeWagen).includes(filter);
      }
      categorie = this.dataToFilter.data.map((v: IVoertuig) => v.categorie.typeWagen).includes(this.search);
      console.log(categorie);
    }

    if(this.selected != 'categorie' && this.selected != 'brandstof' && this.selected != 'status'){
      this.dataToFilter.filterpredicate = (data: any, filter: string) => {
        return data[this.selected] == filter;
      };

    }
    this.passFilteredData.emit(this.dataToFilter.filter = this.search,);


    console.log(this.dataToFilter.filterpredicate);
  }
}
