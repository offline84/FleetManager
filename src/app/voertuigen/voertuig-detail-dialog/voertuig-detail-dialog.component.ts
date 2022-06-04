import { Component, Directive, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../../datastream.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Voertuig } from '../../objects/voertuig';
import { IVoertuig } from '../../objects/iVoertuig';
import { DataExchangeService } from '../../data-exchange.service';
import { map, Observable, startWith } from 'rxjs';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { DeleteConfirmationSheetComponent } from 'src/app/voertuigen/voertuig-delete-confirmation-sheet/voertuig-delete-confirmation-sheet.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-voertuig-detail-dialog',
  templateUrl: './voertuig-detail-dialog.component.html',
  styleUrls: ['./voertuig-detail-dialog.component.css']
})

export class VoertuigDetailDialogComponent implements OnInit {

  // class in htmlcode voor het omschrijven van gebeurtenissen
  @ViewChild('message', { static: false}) message!: ElementRef;

  modifiable: boolean = true;
  forCreation: boolean = true;
  notEditable!: string;
  viewOnly!: string;
  voertuig = new Voertuig();

  autocompleteList: any;
  categories: any;
  brandstoffen: any;
  statussen: any;
  unlinkedBestuurders: any;
  bestuurderLink: any = null;

  autocompleteOptions: Observable<string[]> = new Observable<string[]>();

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
    chassisnummer: new FormControl('',[Validators.required, Validators.pattern("[A-Ha-hJ-Nj-nPR-Zr-z0-9]{13}[0-9]{4}")]),
    merk: new FormControl('',[Validators.required]),
    model: new FormControl('',[Validators.required]),
    nummerplaat: new FormControl('',[Validators.pattern("([1-9O-Zo-z])?[-|\s]?([a-zA-Z]{3})[-|\s]([0-9]{3})|([1-9O-Zo-z])?([a-zA-Z]{3})([0-9]{3})")]),
    bouwjaar: new FormControl(new Date().getFullYear(), [Validators.max( new Date().getFullYear()), Validators.min(1886)]),
    aantalDeuren: new FormControl( 5 , [Validators.min(0)]),
    kleur: new FormControl(''),
    typeBrandstof: new FormControl('',[Validators.required]),
    typeWagen: new FormControl('',[Validators.required]),
    staat: new FormControl('')
  });

  constructor(private datastream: DatastreamService,
              private dialogRef: MatDialogRef<VoertuigDetailDialogComponent>,
              private dataService: DataExchangeService,
              private bottomSheet: MatBottomSheet,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.voertuig = data.entity;
    this.modifiable = data.modifiable;
    this.autocompleteList = data.merken;
  }

  ngOnInit(): void {

    //We kijken of er een object wordt meegegeven via MAT_DIALOG_DATA.
    // Indien ja, patchen we deze in de form.
    if(this.voertuig){
      this.patchObjectToForm(this.voertuig);
    };

    // zet de mode waarin de dialog zich op dit moment bevindt. de mogelijkheden zijn: boolean modifialbe.
    //Deze wordt meegegeven in de MAT_DIALOG_DATA bij opening van de dialog.
    this.IsModifiable(this.modifiable);

    this.datastream.GetCategories().subscribe((data: any) => {
      this.categories = data;
    });

    this.datastream.GetFuels().subscribe((data: any) => {
      this.brandstoffen = data;
    });

    this.datastream.GetStatusses().subscribe((data: any) => {
      this.statussen = data;
    });

    // We hebben voor de koppeling met bestuurders enkel de bestuurders nodig zonder koppeling met de entiteit
    //+ de bestuurder die al dan niet reeds gekoppeld is met de entiteit. deze worden opgeslagen in unlinkedBestuurders
    //en de bestuurder van de koppeling in de var. bestuurderLink.
    if(!this.voertuig){
      this.datastream.GetAllBestuurders().subscribe((data: any) =>{
        this.unlinkedBestuurders = data.filter((u: any) => u.koppeling.chassisnummer == null);
      });
    }
    else{
      this.datastream.GetAllBestuurders().subscribe((data: any) =>{
        this.unlinkedBestuurders = data.filter((u: any) => u.koppeling.chassisnummer == null || u.koppeling.chassisnummer == this.voertuig.chassisnummer);
        if(this.voertuig){
          if(this.voertuig.koppeling){
            let link = data.filter((u: any) => u.koppeling.chassisnummer == this.voertuig.chassisnummer);
            this.bestuurderLink = link[0];
          }
        }
      });
    }

    //listener voor de autocompete functie
    this.autocompleteOptions = this.voertuigForm.controls["merk"].valueChanges.pipe(startWith(''),
    map(value => this._autocomplete(value)));

    //listener voor het sluiten van de dialog + transfer object naar de tabel.
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
      this.IsModifiable(false);
      let success = 'nieuw voertuig met chassisnummer "' + this.voertuig.chassisnummer +'" is successvol toegevoegd aan de database.';
      this.message.nativeElement.innerHTML = success;
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
      entitytype: "voertuig",
      entity: this.voertuig
    };

    let bottomsheetRef = this.bottomSheet.open(DeleteConfirmationSheetComponent, config);
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

  // Deze method opent bij het klikken op de link in de voertuig-detail-dialog view mode, de view mode in de bestuurdersectie van de applicatie van desbetreffende bestuurder.
  // Eerst zorgen we ervoor dat de huidige dialog gesloten wordt, dan geven we via de data exchange service de opdracht om de view dialog te openen
  // en vervolgens navigeren we naar de bestuurderssectie van de applicatie.
  OpenBestuurdersDetails = () => {
    this.dialogRef.close();
    this.dataService.sendData("bestuurder","view", this.bestuurderLink);
    let navi =this.router.navigate(['/bestuurders']);
  }

  onSave = () => {
    let vehicle = this.CreateObjectToSend();

    this.datastream.UpdateVehicle(vehicle).subscribe( (res: any) =>{

      if(res){
        this.voertuig = res;
        this.patchObjectToForm(res);
      }
    }, error => {
      this.message.nativeElement.innerHTML = error.error;
    }, () => {
      this.IsModifiable(false);
      let success = 'voertuig met chassisnummer "' + this.voertuig.chassisnummer +'" is geupdate';
      this.message.nativeElement.innerHTML = success;
      }
    );
  }

  // Omdat we enkel het correcte resultaat willen weergeven en deze in de tabel updaten voor geslaagde patch-bewerkingen naar de API,
  //gebruiken we de depricated manier van httpclient. + errormessagebehandeling.
  linkUnlinkDriver = () =>{

    if(this.bestuurderLink){
      if(this.voertuig.koppeling){

        this.datastream.UnlinkVehicle(this.voertuig.chassisnummer).subscribe(() =>{

          this.voertuig.koppeling = null;

        }, error =>{
          if(error){
            this.message.nativeElement.innerHTML = error.message;
          }
        }, () =>{
          let success = this.bestuurderLink.naam + " " + this.bestuurderLink.achternaam + " is ontkoppeld van het voertuig";
          this.message.nativeElement.innerHTML = success;
        }
        );
      }
      else{
        this.datastream.LinkVehicle(this.bestuurderLink.rijksregisternummer, this.voertuig.chassisnummer).subscribe(() =>{
        }, error =>{
          if(error){
            this.message.nativeElement.innerHTML = error.message;
          }
        }, () =>{
          let success = this.bestuurderLink.naam + " " + this.bestuurderLink.achternaam + " is nu gekoppeld aan het voertuig";
          this.message.nativeElement.innerHTML = success;

          this.datastream.GetSingleVehicle(this.voertuig.chassisnummer).subscribe((res: any) =>{
            if(res){
              this.voertuig = res;
            }
            else{
              this.message.nativeElement.innerHTML = "Error: Voertuig onbekend in de database";
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

  //indien een voertuig is meegegeven wordt deze via deze method gepatched met de voertuigForm.
  //De niet gepatchede controls worden handmatig ingegeven.
  patchObjectToForm = (entity: Voertuig) =>{
    this.voertuigForm.patchValue(this.voertuig);
    this.voertuigForm.controls["typeBrandstof"].setValue(this.voertuig.brandstof.typeBrandstof);
    this.voertuigForm.controls["typeWagen"].setValue(this.voertuig.categorie.typeWagen);
    if(this.voertuig.status)
      this.voertuigForm.controls["staat"].setValue(this.voertuig.status.staat);
  }

  // Elke property dient meegegeven te worden aan de api, null waardes voor getallen en strings kunnen niet verwerkt worden
  // en resulteert tot een error van de API.
  CreateObjectToSend =(): IVoertuig => {
    let vehicle = new Voertuig;

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

  private _autocomplete(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autocompleteList.filter((merk: string )=> merk.toLowerCase().includes(filterValue));
  }
}
