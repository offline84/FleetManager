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

  detectChanges(e: string) {
    this.passFilteredData.emit(this.dataToFilter.filter = e);
    console.log(this.search);
 }

  FilterResults = () => {
    let property: string;
    let filterArray: any;
    let dataSource: MatTableDataSource<any> = new MatTableDataSource();


    //TO DO make filters work for nested objects.

    this.dataToFilter.filterPredicate = (data: IVoertuig, filter: string): boolean => {
      const dataStr = Object.keys(data).reduce((currentTerm: string, key: string) => {
        return (currentTerm + (data as { [key: string]: any })[key] + '◬');
      }, '').toLowerCase();

      const transformedFilter = filter.trim().toLowerCase();

      return dataStr.indexOf(transformedFilter) != -1;
    }
    filterArray = this.dataToFilter.data;
    const dataStr = Object.keys(filterArray[0]).reduce((currentTerm: string, key: string) => {
      return (currentTerm + (filterArray as { [key: string]: any })[key] + '◬');
    }, '').toLowerCase();
    console.log(dataStr);
    console.log(filterArray);

    this.passFilteredData.emit(this.dataToFilter.filter = this.search,);

  }
}
