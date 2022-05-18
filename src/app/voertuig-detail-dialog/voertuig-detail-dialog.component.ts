import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../datastream.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { IVoertuig } from '../objects/iVoertuig';


@Component({
  selector: 'app-voertuig-detail-dialog',
  templateUrl: './voertuig-detail-dialog.component.html',
  styleUrls: ['./voertuig-detail-dialog.component.css']
})
export class VoertuigDetailDialogComponent implements OnInit {

  properties: any;
  entity: string;
  categories: any;
  brandstoffen: any;
  statussen: any;
  voertuig!: IVoertuig;


  voertuigForm = new FormGroup({
    chassisnummer: new FormControl('',[Validators.required, Validators.minLength(17), Validators.maxLength(17)]),
    merk: new FormControl('',[Validators.required]),
    model: new FormControl('',[Validators.required]),
    nummerplaat: new FormControl('',[Validators.minLength(6), Validators.maxLength(9)]),
    bouwjaar: new FormControl(''),
    aantalDeuren: new FormControl(''),
    kleur: new FormControl(''),
    brandstof: new FormGroup({
      id: new FormControl(),
      typeBrandstof: new FormControl('',[Validators.required])
    }),
    categorie: new FormGroup({
      id: new FormControl(),
      typeWagen: new FormControl('',[Validators.required])
    }),
    status: new FormGroup({
      id: new FormControl(),
      staat: new FormControl()
    })
  });

  constructor(private datastream: DatastreamService, private dialogRef: MatDialogRef<VoertuigDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.properties = data.properties;
    this.entity = data.entity;
   }

  ngOnInit(): void {
    this.datastream.GetCategories().subscribe((data: any) => {
      this.categories = data;
    });

    this.datastream.GetFuels().subscribe((data: any) => {
      this.brandstoffen = data;
    });

    this.datastream.GetStatusses().subscribe((data: any) => {
      this.statussen = data;
    });

  }

  onSubmit = () => {

  }

}
