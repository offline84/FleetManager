import { Component, Directive, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../../datastream.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { Bestuurder } from '../../objects/bestuurder';
import { DataExchangeService } from '../../data-exchange.service';
import { Adres } from 'src/app/objects/adres';
import { map, Observable, startWith } from 'rxjs';


@Component({
  selector: 'app-bestuurder-detail-dialog',
  templateUrl: './bestuurder-detail-dialog.component.html',
  styleUrls: ['./bestuurder-detail-dialog.component.css']
})

export class BestuurderDetailDialogComponent implements OnInit {

  // class in htmlcode voor het omschrijven van gebeurtenissen
  @ViewChild('message', { static: false }) message!: ElementRef;

  modifiable: boolean = true;
  forCreation: boolean = true;
  notEditable!: string;
  viewOnly!: string;
  adres = new Adres();
  bestuurder = new Bestuurder();

  autocompleteList: any;
  rijbewijzen: any;
  unlinkedVoertuigen: any;
  unlinkedTankkaarten: any;
  voertuigLink: any = null;
  tankkaartLink: any = null;

  autocompleteOptions: Observable<string[]> = new Observable<string[]>();

  rijbewijs = {
    id: "",
    typeRijbewijs: ""
  };




  // deze Formgroep behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
  // de benodigde properties weer te geven. Later worden deze terug omgezet in objecten. zie function: CreateObjectToSend
  bestuurderForm = new FormGroup({
    rijksregisternummer: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    naam: new FormControl('', [Validators.required]),
    achternaam: new FormControl('', [Validators.required]),
    geboorteDatum: new FormControl(new Date().getFullYear(), [Validators.max(new Date().getFullYear()), Validators.min(1900)]),
  });

  adresForm = new FormGroup({
    straat: new FormControl('', [Validators.required]),
    huisnummer: new FormControl('', [Validators.required]),
    stad: new FormControl('', [Validators.required]),
    postcode: new FormControl('', [Validators.required]),
  });

  constructor(private datastream: DatastreamService, private dialogRef: MatDialogRef<BestuurderDetailDialogComponent>, private dataService: DataExchangeService, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.bestuurder = data.entity;
    this.modifiable = data.modifiable;
  }

  ngOnInit(): void {

    // We kijken of er een object wordt meegegeven via MAT_DIALOG_DATA.
    // Indien ja, patchen we deze in de form.
    if (this.bestuurder) {
      this.patchObjectToForm(this.bestuurder);
    };

    // zet de mode waarin de dialog zich op dit moment bevindt. de mogelijkheden zijn: boolean modifialbe.
    //Deze wordt meegegeven in de MAT_DIALOG_DATA bij opening van de dialog.

    this.IsModifiable(this.modifiable);

    this.datastream.GetDriverLicences().subscribe((data: any) => {
      this.rijbewijzen = data;
    });

    // We hebben voor de koppeling met bestuurders enkel de bestuurders nodig zonder koppeling met de entiteit
    //+ de bestuurder die al dan niet reeds gekoppeld is met de entiteit. deze worden opgeslagen in unlinkedVoertuigen
    //en de bestuurder van de koppeling in de var. voertuigLink.
    if (!this.bestuurder) {
      this.datastream.GetAllVehicles().subscribe((data: any) => {
        this.unlinkedVoertuigen = data.filter((u: any) => u.chassisnummer == null);
      });
    } else {
      this.datastream.GetAllVehicles().subscribe((data: any) => {
        this.unlinkedVoertuigen = data.filter((u: any) => u.chassisnummer == null || u.chassisnummer == this.bestuurder.koppeling.chassisnummer);
        if (this.bestuurder) {
          if (this.bestuurder.koppeling) {
            let link = data.filter((u: any) => u.chassisnummer == this.bestuurder.koppeling.chassisnummer);
            if (link != null) {
              this.voertuigLink = link[0];
            }
          }
        }
      });
    }

    if (!this.bestuurder) {
      this.datastream.GetAllFuelCards().subscribe((data: any) => {
        this.unlinkedTankkaarten = data.filter((u: any) => u.kaartnummer == null);
      });
    } else {
      this.datastream.GetAllFuelCards().subscribe((data: any) => {
        this.unlinkedTankkaarten = data.filter((u: any) => u.kaartnummer == null || u.kaartnummer == this.bestuurder.koppeling.kaartnummer);
        if (this.bestuurder) {
          if (this.bestuurder.koppeling) {
            let link = data.filter((u: any) => u.kaartnummer == this.bestuurder.koppeling.kaartnummer);
            if (link != null) {
              this.tankkaartLink = link[0];
            }
          }
        }
      });
    }

    //listener voor de autocompete functie
    // this.autocompleteOptions = this.bestuurderForm.controls["straat"].valueChanges.pipe(startWith(''),
    //   map(value => this._autocomplete(value)));

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
    this.IsModifiable(true);
    this.notEditable = "changeColor";
    this.viewOnly = "";
  }

  openDeleteScreen = () => {

  }

  //Aangezien mat-select werkt met een formcontrol en deze hier niet is aangemaakt omdat de bestuurderLink een object omvat, implementeren we de selectie handmatig via een eventlistener.
  onSelectionChangeVoertuig = (event: any) => {
    let link = this.unlinkedVoertuigen.filter((u: any) => u.chassisnummer == event);
    this.voertuigLink = link[0];
  }

  onSelectionChangeTankkaart = (event: any) => {
    let link = this.unlinkedTankkaarten.filter((u: any) => u.kaartnummer == event);
    this.tankkaartLink = link[0];
  }


  //To Do route naar bestuurders en open daar automatisch met het behavioursubject de detail dialog voor de meegegeven bestuurder.
  OpenVoertuigenDetails = () => {
    this.dataService.sendData("voertuig", "view", this.voertuigLink);
  }

  OpenTankkaartenDetails = () => {
    this.dataService.sendData("tankkaart", "view", this.voertuigLink);
  }


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

  // Omdat we enkel het correcte resultaat willen weergeven en deze in de tabel updaten voor geslaagde patch-bewerkingen naar de API,
  //gebruiken we de depricated manier van httpclient. + errormessagebehandeling.
  linkUnlinkVoertuig = () => {
    if (this.voertuigLink) {
      if (this.bestuurder.koppeling) {
        this.datastream.UnlinkVehicle(this.bestuurder.koppeling.chassisnummer).subscribe(() => {
          this.bestuurder.koppeling.chassisnummer = null;
        }, error => {
          if (error) { this.message.nativeElement.innerHTML = error.message; }
        }, () => {
          let success = "Voertuig met chassisnummer: " + this.voertuigLink.chassisnummer + " is ontkoppeld van de bestuurder";
          this.message.nativeElement.innerHTML = success;
        });
      } else {
        this.datastream.LinkVehicle(this.bestuurder.rijksregisternummer, this.voertuigLink.chassisnummer).subscribe(() => {
        }, error => {
          if (error) { this.message.nativeElement.innerHTML = error.message; }
        }, () => {
          let success = "Voertuig met chassisnummer: " + this.voertuigLink.chassisnummer + " is nu gekoppeld aan de bestuurder";
          this.message.nativeElement.innerHTML = success;
          this.datastream.GetSingleDriver(this.voertuigLink.chassisnummer).subscribe((res: any) => {
            if (res) {
              this.bestuurder = res;
            } else {
              this.message.nativeElement.innerHTML = "Error: Bestuurder onbekend in de database";
            }
          });
        });
      }
    }
  }

  linkUnlinkTankkaart = () => {
    if (this.tankkaartLink) {
      if (this.bestuurder.koppeling) {
        this.datastream.UnlinkFuelCard(this.bestuurder.koppeling.kaartnummer).subscribe(() => {
          this.bestuurder.koppeling.kaartnummer = null;
        }, error => {
          if (error) { this.message.nativeElement.innerHTML = error.message; }
        }, () => {
          let success = "Tankkaarnummer: " + this.tankkaartLink.kaartnummer + " is ontkoppeld van de bestuurder";
          this.message.nativeElement.innerHTML = success;
        });
      } else {
        this.datastream.LinkVehicle(this.bestuurder.rijksregisternummer, this.tankkaartLink.kaartnummer).subscribe(() => {
        }, error => {
          if (error) { this.message.nativeElement.innerHTML = error.message; }
        }, () => {
          let success = "Tankkaarnummer: " + this.tankkaartLink.kaartnummer + " is nu gekoppeld aan de bestuurder";
          this.message.nativeElement.innerHTML = success;
          this.datastream.GetSingleDriver(this.tankkaartLink.kaartnummer).subscribe((res: any) => {
            if (res) {
              this.bestuurder = res;
            } else {
              this.message.nativeElement.innerHTML = "Error: Bestuurder onbekend in de database";
            }
          });
        });
      }
    }
  }

  //behandelt de mode waarin de dialog zich bevindt.
  IsModifiable = (ismodifiable: boolean) =>{
    this.modifiable = ismodifiable
    if(!ismodifiable){
      this.forCreation = false;
      this.notEditable = "changeColor";
      // this.viewOnly ="changeColor";
    }
  }

  //indien een bestuurder is meegegeven wordt deze via deze method gepatched met de bestuurderForm.
  //De niet gepatched controls worden handmatig ingegeven.
  patchObjectToForm = (entity: Bestuurder) => {
    this.bestuurderForm.patchValue(this.bestuurder);
    // this.bestuurderForm.controls["typeBrandstof"].setValue(this.bestuurderForm.adres.typeBrandstof);
    // this.bestuurderForm.controls["typeWagen"].setValue(this.bestuurderForm.categorie.typeWagen);
    // if(this.bestuurderForm.status)
    //   this.voertuigForm.controls["staat"].setValue(this.voertuig.status.staat);
    this.adresForm.patchValue(this.bestuurder.adres);
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

  private _autocomplete(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autocompleteList.filter((merk: string) => merk.toLowerCase().includes(filterValue));
  }
}
