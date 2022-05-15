import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    console.log(this.dataToFilter);
    let property: string;

    if(this.selected == 'status')
      property = "status.staat";
    else if(this.selected == 'brandstof')
      property = "brandstof[typeBrandstof]";
    else if(this.selected == 'categorie')
        property = "categorie[typeWagen]";
    else
      property = this.selected;


    this.dataToFilter.filterpredicate = function (data: any, filter: string) {
      return data[property] == filter;
    }

    this.passFilteredData.emit(this.dataToFilter.filter = this.search);
  }
}
