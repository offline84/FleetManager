import { Component, Directive, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../../datastream.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Bestuurder } from '../../objects/bestuurder';
import { IBestuurder } from '../../objects/iBestuurder';
import { DataExchangeService } from '../../data-exchange.service';


@Component({
  selector: 'app-bestuurder-detail-dialog',
  templateUrl: './bestuurder-detail-dialog.component.html',
  styleUrls: ['./bestuurder-detail-dialog.component.css']
})

export class BestuurderDetailDialogComponent implements OnInit {

  // class in htmlcode voor het omschrijven van gebeurtenissen
  @ViewChild('message', { static: false}) message!: ElementRef;

  modifiable: boolean = true;
  forCreation: boolean = true;
  notEditable!: string;
  viewOnly!: string;
  bestuurder = new Bestuurder();

  rijbewijzen: any;
  unlinkedVoertuigen: any;
  unlinkedTankkaarten: any;
  voertuigLink: any = null;
  tankKaartLink: any = null;

  rijbewijs={
    id: "",
    typeRijbewijs: ""
  };

  


  // deze Formgroep behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
  // de benodigde properties weer te geven. Later worden deze terug omgezet in objecten. zie function: CreateObjectToSend
  bestuurderForm = new FormGroup({
    rijksregisternummer: new FormControl('',[Validators.required, Validators.pattern("[0-9]{13}[0-9]{4}")]),
    naam: new FormControl('',[Validators.required]),
    achternaam: new FormControl('',[Validators.required]),
    geboorteDatum: new FormControl(new Date().getFullYear(), [Validators.max(new Date().getFullYear()), Validators.min(1900)]),
  });

  adresForm = new FormGroup({
    straat:  new FormControl('',[Validators.required]),
    huisnummer: new FormControl('',[Validators.required]),
    stad: new FormControl('',[Validators.required]),
  });

  constructor(private datastream: DatastreamService, private dialogRef: MatDialogRef<BestuurderDetailDialogComponent>, private dataService: DataExchangeService, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.bestuurder = data.entity;
    this.modifiable = data.modifiable;
  }

  ngOnInit(): void {

    // We kijken of er een object wordt meegegeven via MAT_DIALOG_DATA.
    // Indien ja, patchen we deze in de form.
    if(this.bestuurder){
      this.patchObjectToForm(this.bestuurder);
    };

    // zet de mode waarin de dialog zich op dit moment bevindt. de mogelijkheden zijn: boolean modifialbe.
    //Deze wordt meegegeven in de MAT_DIALOG_DATA bij opening van de dialog.

    this.IsModifiable(this.modifiable);

    this.datastream.GetDriverLicences().subscribe((data: any) => {
      this.rijbewijzen = data;
    });

    // // We hebben voor de koppeling met bestuurders enkel de bestuurders nodig zonder koppeling met de entiteit
    // //+ de bestuurder die al dan niet reeds gekoppeld is met de entiteit. deze worden opgeslagen in unlinkedBestuurders
    // //en de bestuurder van de koppeling in de var. bestuurderLink.
    // this.datastream.GetAllBestuurders().subscribe((data: any) =>{
    //   this.unlinkedBestuurders = data.filter((u: any) => u.koppeling.chassisnummer == null || u.koppeling.chassisnummer == this.voertuig.chassisnummer);
    //   if(this.voertuig){
    //     if(this.voertuig.koppeling){
    //       let link = data.filter((u: any) => u.koppeling.chassisnummer == this.voertuig.chassisnummer);
    //       this.bestuurderLink = link[0];
    //     }
    //   }
    // });

    //listener voor het sluiten van de dialog + transfer object naar de tabel.
    this.dialogRef.backdropClick().subscribe(() => {
        this.dialogRef.close(this.bestuurder);
    });
  }

  //Omvat de creatie van het te verzenden object en de wissel van mode "add" naar "view" + errorbehandeling.
  onSubmit = () => {

//     let vehicle = this.CreateObjectToSend();

//     this.datastream.PostVehicle(vehicle).subscribe( (res: any) =>{

//       if(res){
//         this.voertuig = res;
//       }
//     }, error => {
//       this.message.nativeElement.innerHTML = error.error;
//     }, () => {
//       this.IsModifiable(false);
//       let success = 'nieuw voertuig met chassisnummer "' + this.voertuig.chassisnummer +'" is successvol toegevoegd aan de database.';
//       this.message.nativeElement.innerHTML = success;
//       }
//     );
  }

  openUpdateScreen = () => {
    this.forCreation = false;
    // this.IsModifiable(true);
    this.notEditable = "changeColor";
    this.viewOnly = "";
  }

  openDeleteScreen = () => {

  }

//   //Aangezien mat-select werkt met een formcontrol en deze hier niet is aangemaakt omdat de bestuurderLink een object omvat, implementeren we de selectie handmatig via een eventlistener.
//   onSelectionChange = (event: any) => {
//     let link = this.unlinkedBestuurders.filter((u: any) => u.rijksregisternummer == event);
//     this.bestuurderLink = link[0];
//   }

//   //To Do route naar bestuurders en open daar automatisch met het behavioursubject de detail dialog voor de meegegeven bestuurder.
//   OpenBestuurdersDetails = () => {
//     this.dataService.follow("view bestuurder");
//     this.dataService.sendData("view bestuurder", this.bestuurderLink);
//   }

  onSave = () => {
//     let vehicle = this.CreateObjectToSend();

//     this.datastream.UpdateVehicle(vehicle).subscribe( (res: any) =>{

//       if(res){
//         this.voertuig = res;
//         this.patchObjectToForm(res);
//       }
//     }, error => {
//       this.message.nativeElement.innerHTML = error.error;
//     }, () => {
//       this.IsModifiable(false);
//       let success = 'voertuig met chassisnummer "' + this.voertuig.chassisnummer +'" is geupdate';
//       this.message.nativeElement.innerHTML = success;
//       }
//     );
  }

//   // Omdat we enkel het correcte resultaat willen weergeven en deze in de tabel updaten voor geslaagde patch-bewerkingen naar de API,
//   //gebruiken we de depricated manier van httpclient. + errormessagebehandeling.
//   linkUnlinkDriver = () =>{

//     if(this.bestuurderLink){
//       if(this.voertuig.koppeling){

//         this.datastream.UnlinkVehicle(this.voertuig.chassisnummer).subscribe(() =>{

//           this.voertuig.koppeling = null;

//         }, error =>{
//           if(error){
//             this.message.nativeElement.innerHTML = error.message;
//           }
//         }, () =>{
//           let success = this.bestuurderLink.naam + " " + this.bestuurderLink.achternaam + " is ontkoppeld van het voertuig";
//           this.message.nativeElement.innerHTML = success;
//         }
//         );
//       }
//       else{
//         this.datastream.LinkVehicle(this.bestuurderLink.rijksregisternummer, this.voertuig.chassisnummer).subscribe(() =>{
//         }, error =>{
//           if(error){
//             this.message.nativeElement.innerHTML = error.message;
//           }
//         }, () =>{
//           let success = this.bestuurderLink.naam + " " + this.bestuurderLink.achternaam + " is nu gekoppeld aan het voertuig";
//           this.message.nativeElement.innerHTML = success;

//           this.datastream.GetSingleVehicle(this.voertuig.chassisnummer).subscribe((res: any) =>{
//             if(res){
//               this.voertuig = res;
//             }
//             else{
//               this.message.nativeElement.innerHTML = "Error: Voertuig onbekend in de database";
//             }
//           });
//         }
//         );
//       }
//     }
//   }

  //behandelt de mode waarin de dialog zich bevindt.
  IsModifiable = (ismodifiable: boolean) =>{
    this.modifiable = ismodifiable
    if(!ismodifiable){
      this.forCreation = false;
      this.notEditable = "changeColor";
      this.viewOnly ="changeColor";
    }
  }
  
  //indien een bestuurder is meegegeven wordt deze via deze method gepatched met de bestuurderForm.
  //De niet gepatched controls worden handmatig ingegeven.
  patchObjectToForm = (entity: Bestuurder) =>{
    this.bestuurderForm.patchValue(this.bestuurder);
    // this.bestuurderForm.controls["typeBrandstof"].setValue(this.bestuurderForm.adres.typeBrandstof);
    // this.bestuurderForm.controls["typeWagen"].setValue(this.bestuurderForm.categorie.typeWagen);
    // if(this.bestuurderForm.status)
    //   this.voertuigForm.controls["staat"].setValue(this.voertuig.status.staat);
  }

//   // Elke property dient meegegeven te worden aan de api, null waardes voor getallen en strings kunnen niet verwerkt worden
//   // en resulteert tot een error van de API.
//   CreateObjectToSend =(): IVoertuig => {
//     let vehicle = new Voertuig;
    
//     if(!this.voertuigForm.controls["nummerplaat"].value){
//       if(this.voertuigForm.controls["staat"].value != "aankoop"){
//         this.message.nativeElement.innerHTML = "error: Indien het voertuig niet de status 'aankoop' heeft, dient men een nummerplaat mee te geven";
//       }
//       else{
//         this.voertuigForm.controls["nummerplaat"].setValue("");
//       }
//     }

//     if(!this.voertuigForm.controls["aantalDeuren"].value){
//       this.voertuigForm.controls["aantalDeuren"].setValue(0);
//     }

//     if(!this.voertuigForm.controls["kleur"].value){
//       this.voertuigForm.controls["kleur"].setValue("");
//     }

//     if(!this.voertuigForm.controls["staat"].value){
//       this.voertuigForm.controls["staat"].setValue("in bedrijf");
//     }

//     vehicle.chassisnummer = this.voertuigForm.controls["chassisnummer"].value;
//     vehicle.model = this.voertuigForm.controls["model"].value;
//     vehicle.merk = this.voertuigForm.controls["merk"].value;
//     vehicle.model = this.voertuigForm.controls["model"].value;
//     vehicle.bouwjaar = this.voertuigForm.controls["bouwjaar"].value;
//     vehicle.nummerplaat = this.voertuigForm.controls["nummerplaat"].value;
//     vehicle.aantalDeuren = this.voertuigForm.controls["aantalDeuren"].value;
//     vehicle.kleur = this.voertuigForm.controls["kleur"].value;
//     vehicle.brandstof = this.brandstoffen.find((v: any) => v.typeBrandstof == this.voertuigForm.controls["typeBrandstof"].value);
//     vehicle.categorie = this.categories.find((v: any) => v.typeWagen == this.voertuigForm.controls["typeWagen"].value);
//     vehicle.status = this.statussen.find((v: any) => v.staat == this.voertuigForm.controls["staat"].value);

//     return vehicle;
//   }
}
