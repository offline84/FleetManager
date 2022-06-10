import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DatastreamService} from '../../datastream.service';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Tankkaart} from "../../objects/tankkaart";
import {ITankkaart} from "../../objects/iTankkaart";
import {DataExchangeService} from '../../data-exchange.service';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import {
  TankkaartDeleteConfirmationSheetComponent
} from "../tankkaart-delete-confirmation-sheet/tankkaart-delete-confirmation-sheet.component";
import {Brandstof} from "../../objects/brandstof";
import {mogelijkeBrandstof} from "../../objects/mogelijkeBrandstof";

@Component({
  selector: 'app-tankkaart-detail-dialog',
  templateUrl: './tankkaart-detail-dialog.component.html',
  styleUrls: ['./tankkaart-detail-dialog.component.css'],
})

export class TankkaartDetailDialogComponent implements OnInit {

  // class in htmlcode voor het omschrijven van gebeurtenissen
  @ViewChild('message', { static: false}) message!: ElementRef;

  modifiable: boolean = true;
  forCreation: boolean = true;
  notEditable!: string;
  viewOnly!: string;
  hide: boolean = true;
  tankkaart = new Tankkaart();

  KeuzeBrandstoffen: any;
  unlinkedBestuurders: any;
  bestuurderLink: any = null;

  brandstof={
    id: "",
    typeBrandstof: ""
  };


  // deze Formgroep behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
  // de benodigde properties weer te geven. Later worden deze terug omgezet in objecten. zie function: CreateObjectToSend
  tankkaartForm = new FormGroup({
    kaartnummer: new FormControl('',[Validators.required]),
    geldigheidsdatum: new FormControl(new Date().toISOString().slice(0,-5),[Validators.required]),
    pincode: new FormControl('',),
    isGeblokkeerd: new FormControl(false,[Validators.required]),
    typeBrandstof: new FormControl('',),
  });

  constructor(private datastream: DatastreamService,
              private dialogRef: MatDialogRef<TankkaartDetailDialogComponent>,
              private dataService: DataExchangeService,
              private bottomSheet: MatBottomSheet,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.tankkaart = data.entity;
    this.modifiable = data.modifiable;
  }

  ngOnInit(): void {

    //We kijken of er een object wordt meegegeven via MAT_DIALOG_DATA.
    // Indien ja, patchen we deze in de form.
    if(this.tankkaart){
      this.patchObjectToForm(this.tankkaart);
    };

    // zet de mode waarin de dialog zich op dit moment bevindt. de mogelijkheden zijn: boolean modifialbe.
    //Deze wordt meegegeven in de MAT_DIALOG_DATA bij opening van de dialog.
    this.IsModifiable(this.modifiable);

    this.datastream.GetFuels().subscribe((data: any) => {
      this.KeuzeBrandstoffen = data;
    });

    // We hebben voor de koppeling met bestuurders enkel de bestuurders nodig zonder koppeling met de entiteit
    //+ de bestuurder die al dan niet reeds gekoppeld is met de entiteit. deze worden opgeslagen in unlinkedBestuurders
    //en de bestuurder van de koppeling in de var. bestuurderLink.
    if(!this.tankkaart){
      this.datastream.GetAllBestuurders().subscribe((data: any) =>{
        this.unlinkedBestuurders = data.filter((u: any) => u.koppeling.kaartnummer == null);
      });
    }
    else{
      this.datastream.GetAllBestuurders().subscribe((data: any) =>{
        this.unlinkedBestuurders = data.filter((u: any) => u.koppeling.kaartnummer == null || u.koppeling.kaartnummer == this.tankkaart.kaartnummer);
        if(this.tankkaart){
          if(this.tankkaart.koppeling){
            let link = data.filter((u: any) => u.koppeling.kaartnummer == this.tankkaart.kaartnummer);
            this.bestuurderLink = link[0];
          }
        }
      });
    }

    //listener voor het sluiten van de dialog + transfer object naar de tabel.
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(this.tankkaart);
    });
  }

  //Omvat de creatie van het te verzenden object en de wissel van mode "add" naar "view" + errorbehandeling.
  onSubmit = () => {

    let fuelcard = this.CreateObjectToSend();

    this.datastream.PostFuelCard(fuelcard).subscribe( (res: any) =>{
        if(res){
          this.tankkaart = res;
        }
      }, error => {
        this.message.nativeElement.innerHTML = error.error;
      }, () => {
        this.IsModifiable(false);
      this.message.nativeElement.innerHTML = 'Nieuwe tankkaart met kaartnummer "' + this.tankkaart.kaartnummer + '" is successvol toegevoegd aan de database.';
      }
    );
  }

  openUpdateScreen = () => {
    this.forCreation = false;
    this.IsModifiable(true);
    this.notEditable = "changeColor";
    this.viewOnly = "";
  }

  openDeleteScreen = () => {
    const config = new MatBottomSheetConfig();
    config.autoFocus = true;
    config.disableClose = true;

    config.data = {
      entitytype: "tankkaart",
      entity: this.tankkaart
    };

    let bottomsheetRef = this.bottomSheet.open(TankkaartDeleteConfirmationSheetComponent, config);
    bottomsheetRef.afterDismissed().subscribe((deleted: boolean) =>{
      if(deleted){
        this.dialogRef.close();
      }
    });
  }

  //Aangezien mat-select werkt met een formcontrol en deze hier niet is aangemaakt omdat de bestuurderLink een object omvat, implementeren we de selectie handmatig via een eventlistener.
  onSelectionChange = (event: any) => {
    let link = this.unlinkedBestuurders.filter((u: any) => u.rijksregisternummer == event);
    this.bestuurderLink = link[0];
  }

  //To Do route naar bestuurders en open daar automatisch met het behavioursubject de detail dialog voor de meegegeven bestuurder.
  OpenBestuurdersDetails = () => {
    this.dataService.sendData("bestuurder","view", this.bestuurderLink);
  }

  onSave = () => {
    let fuelcard = this.CreateObjectToSend();

    this.datastream.UpdateFuelCard(fuelcard).subscribe( (res: any) =>{

        if(res){
          this.tankkaart = res;
          this.patchObjectToForm(res);
        }
      }, error => {
        this.message.nativeElement.innerHTML = error.error;
      }, () => {
        this.IsModifiable(false);
      this.message.nativeElement.innerHTML = 'Tankkaart met kaartnummer "' + this.tankkaart.kaartnummer + '" is geupdate';
      }
    );
  }

  // Omdat we enkel het correcte resultaat willen weergeven en deze in de tabel updaten voor geslaagde patch-bewerkingen naar de API,
  //gebruiken we de depricated manier van httpclient. + errormessagebehandeling.
  linkUnlinkDriver = () =>{

    if(this.bestuurderLink){
      if(this.tankkaart.koppeling){
        this.datastream.UnlinkFuelCard(this.tankkaart.kaartnummer).subscribe(() =>{
            this.tankkaart.koppeling = null;
          }, error =>{
            if(error){
              this.message.nativeElement.innerHTML = error.message;
            }
          }, () =>{
          this.message.nativeElement.innerHTML = this.bestuurderLink.naam + " " + this.bestuurderLink.achternaam + " is ontkoppeld van de tankkaart";
          }
        );
      }
      else{
        this.datastream.LinkFuelCard(this.bestuurderLink.rijksregisternummer, this.tankkaart.kaartnummer).subscribe(() =>{
          }, error =>{
            if(error){
              this.message.nativeElement.innerHTML = error.message;
            }
          }, () =>{
          this.message.nativeElement.innerHTML = this.bestuurderLink.naam + " " + this.bestuurderLink.achternaam + " is nu gekoppeld aan de tankkaart";

            this.datastream.GetSingleFuelCard(this.tankkaart.kaartnummer).subscribe((res: any) =>{
              if(res){
                this.tankkaart = res;
              }
              else{
                this.message.nativeElement.innerHTML = "Error: Tankkaart onbekend in de database";
              }
            });
          }
        );
      }
    }
  }

  //behandelt de mode waarin de dialog zich bevindt.
  IsModifiable = (ismodifiable: boolean) =>{
    this.modifiable = ismodifiable
    if(!ismodifiable){
      this.forCreation = false;
      this.notEditable = "changeColor";
      this.viewOnly ="changeColor";
    }
  }

  //indien een tankkaart is meegegeven wordt deze via deze method gepatched met de tankkaartForm.
  //De niet gepatchede controls worden handmatig ingegeven.
  patchObjectToForm = (entity: Tankkaart) =>{
    this.tankkaartForm.patchValue(this.tankkaart);
    this.tankkaartForm.controls["geldigheidsdatum"].setValue(entity.geldigheidsDatum.toString());
    if (this.tankkaart.mogelijkeBrandstoffen != null) {
      let lijstBrandstoffen: string[] = [];
      this.tankkaart.mogelijkeBrandstoffen.forEach((mb: any ) => {
        if (mb.brandstof.typeBrandstof != null) {
          lijstBrandstoffen.push(mb.brandstof.typeBrandstof );
        }
        this.tankkaartForm.controls["typeBrandstof"].setValue(lijstBrandstoffen);
      });
    }
  }

  CreateObjectToSend =(): ITankkaart => {
    let fuelcard = new Tankkaart();

    fuelcard.kaartnummer = this.tankkaartForm.controls["kaartnummer"].value;
    fuelcard.geldigheidsDatum = this.tankkaartForm.controls["geldigheidsdatum"].value;
    fuelcard.isGeblokkeerd = this.tankkaartForm.controls["isGeblokkeerd"].value;

    // Elke property dient meegegeven te worden aan de api, null waardes voor getallen en strings kunnen niet verwerkt worden.

    if(!this.tankkaartForm.controls["pincode"].value){
      this.tankkaartForm.controls["pincode"].setValue(9999);
    } else {
      fuelcard.pincode = this.tankkaartForm.controls["pincode"].value;
    }

    if(!this.tankkaartForm.controls["typeBrandstof"].value) {
      this.tankkaartForm.controls["typeBrandstof"].setValue(null);
    } else {
      this.tankkaartForm.controls["typeBrandstof"].value.forEach((typeBrandstof: any) => {
        let brandstof = this.KeuzeBrandstoffen.find((brandstof: any) => brandstof.typeBrandstof == typeBrandstof);
        if (brandstof) {
          let geselecteerdeBrandstof = new Brandstof();
          let geselecteerdeMogelijkeBrandstof = new mogelijkeBrandstof();
          geselecteerdeBrandstof.id = brandstof.id;
          geselecteerdeBrandstof.typeBrandstof = brandstof.typeBrandstof;
          geselecteerdeMogelijkeBrandstof.brandstof = geselecteerdeBrandstof;
          fuelcard.mogelijkeBrandstoffen.push(geselecteerdeMogelijkeBrandstof);
        }
      })
    }

    return fuelcard;
  }
}
