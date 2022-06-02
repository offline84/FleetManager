import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IVoertuig } from '../objects/iVoertuig';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {

  @Output("dataSource") passFilteredData: EventEmitter<any> = new EventEmitter();
  @Input() dataToFilter: any;
  @Input() entity: any;
  search: string = "";


  constructor() {}

  ngOnInit(): void {

  }

  detectChanges(e: string) {
    if(this.entity == "voertuig"){
      this.dataToFilter.filterPredicate = (data: IVoertuig, filter: string) => {
        return data.chassisnummer.toLocaleLowerCase().includes(filter) ||
        data.merk.toLocaleLowerCase().includes(filter) ||
        data.model.toLocaleLowerCase().includes(filter) ||
        data.nummerplaat.toLocaleLowerCase().includes(filter) ||
        data.kleur.toLocaleLowerCase().includes(filter) ||
        data.aantalDeuren.toString().toLocaleLowerCase().includes(filter) ||
        data.bouwjaar.toString().toLocaleLowerCase().includes(filter) ||
        data.categorie.typeWagen.toLocaleLowerCase().includes(filter) ||
        data.brandstof.typeBrandstof.toLocaleLowerCase().includes(filter) ||
        data.status.staat.toLocaleLowerCase().includes(filter);
      }
    }
    if(this.entity == "tankkaart"){

    }
    if(this.entity == "bestuurder"){

    }

    this.passFilteredData.emit(this.dataToFilter.filter = e);
    console.log("query: ", this.search);
 }

 clearQuery = () => {
   this.search = "";
   this.detectChanges(this.search);
 }
}
