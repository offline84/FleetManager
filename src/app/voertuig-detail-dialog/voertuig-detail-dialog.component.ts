import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../datastream.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Voertuig } from '../objects/voertuig';
import { IVoertuig } from '../objects/iVoertuig';


@Component({
  selector: 'app-voertuig-detail-dialog',
  templateUrl: './voertuig-detail-dialog.component.html',
  styleUrls: ['./voertuig-detail-dialog.component.css']
})
export class VoertuigDetailDialogComponent implements OnInit {

  // class in htmlcode voor het omschrijven van gebeurtenissen
  @ViewChild('message', { static: false}) message!: ElementRef;

  mode: any;
  voertuig = new Voertuig();
  readonly = false;

  categories: any;
  brandstoffen: any;
  statussen: any;
  year = new Date().getFullYear();
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

  // deze Formgroep behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
  // de benodigde properties weer te geven. Later worden deze terug omgezet in objecten. zie function: CreateObjectToSend
  voertuigForm = new FormGroup({
    chassisnummer: new FormControl(this.voertuig.chassisnummer,[Validators.required, Validators.pattern("[A-Ha-hJ-Nj-nPR-Zr-z0-9]{13}[0-9]{4}")]),
    merk: new FormControl(this.voertuig.merk,[Validators.required]),
    model: new FormControl(this.voertuig.model,[Validators.required]),
    nummerplaat: new FormControl(this.voertuig.nummerplaat,[Validators.pattern("([1-9O-Zo-z])?[-|\s]?([a-zA-Z]{3})[-|\s]([0-9]{3})|([1-9O-Zo-z])?([a-zA-Z]{3})([0-9]{3})")]),
    bouwjaar: new FormControl(this.voertuig.bouwjaar, [Validators.max( new Date().getFullYear()), Validators.min(1886)]),
    aantalDeuren: new FormControl(this.voertuig.aantalDeuren, [Validators.min(0)]),
    kleur: new FormControl(this.voertuig.kleur),
    typeBrandstof: new FormControl(this.brandstof.typeBrandstof,[Validators.required]),
    typeWagen: new FormControl(this.categorie.typeWagen,[Validators.required]),
    staat: new FormControl(this.status.staat)
  });

  constructor(private datastream: DatastreamService, private dialogRef: MatDialogRef<VoertuigDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.voertuig = data.entity;
    this.mode = data.mode;
  }

  ngOnInit(): void {
    if(!this.voertuig)
      this.voertuigForm.controls["bouwjaar"].setValue(new Date().getFullYear());

    // zet de mode waarin de dialog zich op dit moment bevindt. de mogelijkheden zijn: view, add en edit. de mode wordt weergegeven
    // in de MAT_DIALOG_DATA bij opening van de dialog.
    this.GetMode(this.mode);

    this.datastream.GetCategories().subscribe((data: any) => {
      this.categories = data;
    });

    this.datastream.GetFuels().subscribe((data: any) => {
      this.brandstoffen = data;
    });

    this.datastream.GetStatusses().subscribe((data: any) => {
      this.statussen = data;
    });

    this.dialogRef.backdropClick().subscribe(() => {
        this.dialogRef.close(this.voertuig);
    });
  }

  //Omvat de creatie van het te verzenden object en de wissel van mode "add" naar "view" + errorbehandeling.
  onSubmit = () => {

    let vehicle = this.CreateObjectToSend();

    this.datastream.PostVehicle(vehicle).subscribe( (res: any) =>{

      if(res){
        this.voertuig = res;
      }
    }, error => {
      this.message.nativeElement.innerHTML = error.error;
    }, () => {
      this.GetMode("view");
      let success = 'nieuw voertuig met chassisnummer "' + this.voertuig.chassisnummer +'" is successvol toegevoegd aan de database.';
      this.message.nativeElement.innerHTML = success;
      }
    );
  }

  //behandelt de mode waarin de dialog zich bevindt.
  GetMode = (mode: string) =>{
    this.mode = mode;
    if(mode == "view"){
      this.readonly = true;
      this.voertuigForm.controls["typeBrandstof"].disable();
      this.voertuigForm.controls["typeWagen"].disable();
      this.voertuigForm.controls["staat"].disable();
    }
  }

  CreateObjectToSend =(): IVoertuig => {
    let vehicle = new Voertuig;

    // Elke property dient meegegeven te worden aan de api, null waardes voor getallen en strings kunnen niet verwerkt worden.
    if(!this.voertuigForm.controls["nummerplaat"].value){
      if(this.voertuigForm.controls["staat"].value != "aankoop"){
        this.message.nativeElement.innerHTML = "error: Indien het voertuig niet de status 'aankoop' heeft, dient men een nummerplaat mee te geven";
      }
      else{
        this.voertuigForm.controls["nummerplaat"].setValue("");
      }
    }

    if(!this.voertuigForm.controls["aantalDeuren"].value){
      this.voertuigForm.controls["aantalDeuren"].setValue(0);
    }

    if(!this.voertuigForm.controls["kleur"].value){
      this.voertuigForm.controls["kleur"].setValue("");
    }

    if(!this.voertuigForm.controls["staat"].value){
      this.voertuigForm.controls["staat"].setValue("in bedrijf");
    }

    vehicle.chassisnummer = this.voertuigForm.controls["chassisnummer"].value;
    vehicle.model = this.voertuigForm.controls["model"].value;
    vehicle.merk = this.voertuigForm.controls["merk"].value;
    vehicle.model = this.voertuigForm.controls["model"].value;
    vehicle.bouwjaar = this.voertuigForm.controls["bouwjaar"].value;
    vehicle.nummerplaat = this.voertuigForm.controls["nummerplaat"].value;
    vehicle.aantalDeuren = this.voertuigForm.controls["aantalDeuren"].value;
    vehicle.kleur = this.voertuigForm.controls["kleur"].value;
    vehicle.brandstof = this.brandstoffen.find((v: any) => v.typeBrandstof == this.voertuigForm.controls["typeBrandstof"].value);
    vehicle.categorie = this.categories.find((v: any) => v.typeWagen == this.voertuigForm.controls["typeWagen"].value);
    vehicle.status = this.statussen.find((v: any) => v.staat == this.voertuigForm.controls["staat"].value);

    return vehicle;
  }
}
