import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../../datastream.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Voertuig } from '../../objects/voertuig';


@Component({
  selector: 'app-voertuig-detail-dialog',
  templateUrl: './voertuig-detail-dialog.component.html',
  styleUrls: ['./voertuig-detail-dialog.component.css']
})
export class VoertuigDetailDialogComponent implements OnInit {

  @ViewChild('error', { static: false}) errormessage!: ElementRef;

  entity: string;
  categories: any;
  brandstoffen: any;
  statussen: any;
  year = new Date().getFullYear();
  voertuig = new Voertuig();
  brandstof={
    id: "",
    typeBrandstof: ""
  };
  categorie={
    id: "",
    typeWagen: ""
  };
  status={
    id: "",
    staat: ""
  };

  voertuigForm = new FormGroup({
    chassisnummer: new FormControl(this.voertuig.chassisnummer,[Validators.required, Validators.pattern("[A-Ha-hJ-Nj-nPR-Zr-z0-9]{13}[0-9]{4}")]),
    merk: new FormControl(this.voertuig.merk,[Validators.required]),
    model: new FormControl(this.voertuig.model,[Validators.required]),
    nummerplaat: new FormControl(this.voertuig.nummerplaat,[Validators.pattern("([1-9O-Zo-z])?[-|\s]?([a-zA-Z]{3})[-|\s]([0-9]{3})|([1-9O-Zo-z])?([a-zA-Z]{3})([0-9]{3})")]),
    bouwjaar: new FormControl(this.voertuig.bouwjaar = new Date().getFullYear()),
    aantalDeuren: new FormControl(this.voertuig.aantalDeuren),
    kleur: new FormControl(this.voertuig.kleur),
    typeBrandstof: new FormControl(this.brandstof.typeBrandstof,[Validators.required]),
    typeWagen: new FormControl(this.categorie.typeWagen,[Validators.required]),
    staat: new FormControl(this.status.staat)
  });

  constructor(private datastream: DatastreamService, private dialogRef: MatDialogRef<VoertuigDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
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
    let vehicle = new Voertuig;
    vehicle.chassisnummer = this.voertuigForm.controls["chassisnummer"].value;
    vehicle.model = this.voertuigForm.controls["model"].value;
    vehicle.merk = this.voertuigForm.controls["merk"].value;
    vehicle.model = this.voertuigForm.controls["model"].value;
    if(!this.voertuigForm.controls["nummerplaat"].value)
      if(this.voertuigForm.controls["staat"].value != "aankoop")
        this.errormessage.nativeElement.innerHTML = "error: Indien het voertuig niet de status 'aankoop' heeft, dient men een nummerplaat mee te geven"
    vehicle.nummerplaat = this.voertuigForm.controls["nummerplaat"].value;
    vehicle.bouwjaar = this.voertuigForm.controls["bouwjaar"].value;
    vehicle.aantalDeuren = this.voertuigForm.controls["aantalDeuren"].value;
    vehicle.kleur = this.voertuigForm.controls["kleur"].value;
    vehicle.brandstof = this.brandstoffen.find((v: any) => v.typeBrandstof == this.voertuigForm.controls["typeBrandstof"].value);
    vehicle.categorie = this.categories.find((v: any) => v.typeWagen == this.voertuigForm.controls["typeWagen"].value);
    vehicle.status = this.statussen.find((v: any) => v.staat == this.voertuigForm.controls["staat"].value);

    this.datastream.PostVehicle(vehicle).subscribe( (res: any) =>{
      console.log(res);
        //this.dialogRef.close();
    }, error => {
      this.errormessage.nativeElement.innerHTML = error.error;
    });
  }

}
