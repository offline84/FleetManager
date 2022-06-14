import * as moment from 'moment';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../../datastream.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Bestuurder } from '../../objects/bestuurder';
import { DataExchangeService } from '../../data-exchange.service';
import { Adres } from 'src/app/objects/adres';
import { map, Observable, startWith } from 'rxjs';
import { IBestuurder } from 'src/app/objects/iBestuurder';
import { Rijbewijs } from 'src/app/objects/rijbewijs';
import { ToewijzingRijbewijs } from 'src/app/objects/toewijzingRijbewijs';
import { IVoertuig } from 'src/app/objects/iVoertuig';


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
  rijbewijzen: Array<Rijbewijs> = [];
  unlinkedVoertuigen: any;
  unlinkedTankkaarten: any;
  voertuigLink: any = null;
  tankkaartLink: any = null;
  autocompleteOptions: Observable<string[]> = new Observable<string[]>();

  minDate = new Date();
  maxDate = new Date();


  constructor(private datastream: DatastreamService, private dialogRef: MatDialogRef<BestuurderDetailDialogComponent>, private dataService: DataExchangeService, @Inject(MAT_DIALOG_DATA) private data: any, private formBuilder: FormBuilder,) {
    this.bestuurder = data.entity;
    this.modifiable = data.modifiable;
  }


  // deze Formgroep behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
  // de benodigde properties weer te geven. Later worden deze terug omgezet in objecten. zie function: CreateObjectToSend
  bestuurderForm = new FormGroup({
    rijksregisternummer: new FormControl('', [Validators.required, Validators.max(99999999999), Validators.min(10000000000)]),
    naam: new FormControl('', [Validators.required]),
    achternaam: new FormControl('', [Validators.required]),
    geboorteDatum: new FormControl('', [Validators.required])
  });

  adresForm = new FormGroup({
    straat: new FormControl(''),
    huisnummer: new FormControl('', [Validators.min(1), Validators.max(999999)]),
    stad: new FormControl(''),
    postcode: new FormControl('', [Validators.min(1000), Validators.max(9999)]),
  });


  rijbewijsForm = new FormGroup({
    typeRijbewijs: new FormControl(['', Validators.required])
  });

  ngOnInit(): void {
    let year = moment().year();
    this.minDate = new Date('01/01/'+(year-100));
    this.maxDate = moment().toDate();

    // We kijken of er een object wordt meegegeven via MAT_DIALOG_DATA.
    // Indien ja, patchen we deze in de form.
    if (this.bestuurder) {
      this.patchObjectToForm(this.bestuurder);
    };

    // zet de mode waarin de dialog zich op dit moment bevindt. de mogelijkheden zijn: boolean modifialbe.
    //Deze wordt meegegeven in de MAT_DIALOG_DATA bij opening van de dialog.
    this.IsModifiable(this.modifiable);

    //Haalt de geseede data van de rijbewijzen op en sorteert deze alfabetisch
    this.datastream.GetDriverLicences().subscribe((rijbewijs: any) => {
      this.rijbewijzen = rijbewijs;
      this.rijbewijzen.sort(function (a: any, b:any ) {
        const typeA = a.typeRijbewijs;
        const typeB = b.typeRijbewijs;

        if(typeA < typeB)
          return -1

        if(typeA > typeB)
          return 1

        return 0
      });
    });

    // We hebben voor de koppeling met bestuurders enkel de bestuurders nodig zonder koppeling met de entiteit
    //+ de bestuurder die al dan niet reeds gekoppeld is met de entiteit. deze worden opgeslagen in unlinkedVoertuigen
    //en de bestuurder van de koppeling in de var. voertuigLink.
    if (this.bestuurder) {
      this.datastream.GetVehiclesForLinkingWithDriver(this.bestuurder.rijksregisternummer).subscribe((data: any) => {
        this.unlinkedVoertuigen = data;

        this.datastream.GetSingleVehicle(this.bestuurder.koppeling.chassisnummer).subscribe((data: any) => {
          if(data){
            this.voertuigLink = data;
          }
          else{
            this.voertuigLink = undefined;
          }

          this.datastream.GetFuelCardsToLinkWithDriver(this.bestuurder.rijksregisternummer).subscribe((data: any) => {
            this.unlinkedTankkaarten = data;
            console.log(this.unlinkedTankkaarten);

            this.datastream.GetSingleFuelCard(this.bestuurder.koppeling.kaartnummer).subscribe((data: any) => {
              if(data){
                this.tankkaartLink = data;
              }
              else{
                this.tankkaartLink = undefined;
              }
            });
          });
        });
      });
  }


     this.bestuurderForm.controls["rijksregisternummer"].valueChanges.pipe(
      startWith(''),
      map(value => {
      let dateOfBirth = value;
      if(dateOfBirth >=  10000000000 && dateOfBirth < 99999999999){
      // this.AutoCompleteDateOfBirth(dateOfBirth.toString());
      this._autoCompleteDateOfBirth(value.toString());
      console.log(value);
      } })).subscribe();
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
    let driver = this.CreateObjectToSend();
    this.datastream.PostDriver(driver).subscribe((res: any) => {
      if (res) {
        this.bestuurder = res;
        this.datastream.GetVehiclesForLinkingWithDriver(this.bestuurder.rijksregisternummer).subscribe((data: any) => {
          this.unlinkedVoertuigen = data;
        });
      }
    }, error => {
      this.message.nativeElement.innerHTML = error.error;
    }, () => {
      this.IsModifiable(false);
      let success = 'nieuw bestuurder met rijksregisternummer "' + this.bestuurder.rijksregisternummer + '" is successvol toegevoegd aan de database.';
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

  }

  onSelectionChangeGeboorteDatum() {

  }




  //Aangezien mat-select werkt met een formcontrol en deze hier niet is aangemaakt omdat de bestuurderLink een object omvat, implementeren we de selectie handmatig via een eventlistener.
  onSelectionChangeVoertuig = (event: any) => {
    if (this.tankkaartLink != null) {
      this.unlinkedVoertuigen.filter((v: any) => v.brandstoffen)
      console.log('Check uitvoeren op gekozen item -> indien een bepaalde brandstof gekozen is, mag de andere itemLijst alleen maar dezelfde items.brandstof bevatten')
    }

    let link = this.unlinkedVoertuigen.find((u: any) => u.chassisnummer == event);
    this.voertuigLink = link;
  }

  onSelectionChangeTankkaart = (event: any) => {
    if (this.voertuigLink != null) {
      console.log(this.voertuigLink);
      console.log('Check uitvoeren op gekozen item -> indien een bepaalde brandstof gekozen is, mag de andere itemLijst alleen maar dezelfde items.brandstof bevatten');
    }
    let link = this.unlinkedTankkaarten.find((u: any) => u.kaartnummer == event);
    this.tankkaartLink = link;
  }


  //To Do route naar bestuurders en open daar automatisch met het behavioursubject de detail dialog voor de meegegeven bestuurder.
  OpenVoertuigenDetails = () => {
    this.dataService.sendData("voertuig", "view", this.voertuigLink);
  }

  OpenTankkaartenDetails = () => {
    this.dataService.sendData("tankkaart", "view", this.voertuigLink);
  }

  onSave = () => {
    let driver = this.CreateObjectToSend();
    this.datastream.UpdateDriver(driver).subscribe((res: any) => {
      if (res) {
        this.bestuurder = res;
        this.patchObjectToForm(res);
      }
    }, error => {
      this.message.nativeElement.innerHTML = error.error;
    }, () => {
      this.IsModifiable(false);
      let success = 'bestuurder met rijksregisternummer "' + this.bestuurder.rijksregisternummer + '" is geupdate';
      this.message.nativeElement.innerHTML = success;
    }
    );
  }

  // Omdat we enkel het correcte resultaat willen weergeven en deze in de tabel updaten voor geslaagde patch-bewerkingen naar de API,
  //gebruiken we de depricated manier van httpclient. + errormessagebehandeling.
  linkUnlinkVoertuig = () => {
    if (this.voertuigLink) {
      if (this.bestuurder.koppeling.chassisnummer) {
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
          this.bestuurder.koppeling.chassisnummer = this.voertuigLink.chassisnummer;
          // hier komt ophalen lijst
        }, error => {
          if (error) { this.message.nativeElement.innerHTML = error.message; }
        }, () => {
          let success = "Voertuig met chassisnummer: " + this.voertuigLink.chassisnummer + " is nu gekoppeld aan de bestuurder";
          this.message.nativeElement.innerHTML = success;
          this.datastream.GetSingleDriver(this.bestuurder.rijksregisternummer).subscribe((res: any) => {
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
        this.datastream.LinkFuelCard(this.bestuurder.rijksregisternummer, this.tankkaartLink.kaartnummer).subscribe(() => {
          this.datastream.GetVehiclesForLinkingWithDriver(this.bestuurder.rijksregisternummer).subscribe((data: any) => {
            this.unlinkedVoertuigen = data;
          });
        }, error => {
          if (error) { this.message.nativeElement.innerHTML = error.message; }
        }, () => {
          let success = "Tankkaarnummer: " + this.tankkaartLink.kaartnummer + " is nu gekoppeld aan de bestuurder";
          this.message.nativeElement.innerHTML = success;
          this.datastream.GetSingleDriver(this.bestuurder.rijksregisternummer).subscribe((res: any) => {
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
  IsModifiable = (ismodifiable: boolean) => {
    this.modifiable = ismodifiable
    if (!ismodifiable) {
      this.forCreation = false;
      this.notEditable = "changeColor";
      this.viewOnly = "changeColor";
    }
  }

  //indien een bestuurder is meegegeven wordt deze via deze method gepatched met de bestuurderForm.
  //De niet gepatched controls worden handmatig ingegeven.
  patchObjectToForm = (entity: Bestuurder) => {
    this.bestuurderForm.patchValue(this.bestuurder);
    if (this.bestuurder.toewijzingenRijbewijs != null) {
      let dataArray: string[] = [];
      this.bestuurder.toewijzingenRijbewijs.forEach(toewijzing => {
        var rijbewijs = this.bestuurder.rijbewijzen.find((r: Rijbewijs) => r.id == toewijzing.rijbewijsId);
        if (rijbewijs) {
          dataArray.push(rijbewijs.typeRijbewijs);
        }
      });
      this.rijbewijsForm.controls["typeRijbewijs"].setValue(dataArray);
    }

    this.adresForm.patchValue(this.bestuurder.adres);
  }



  // Elke property dient meegegeven te worden aan de api, null waardes voor getallen en strings kunnen niet verwerkt worden
  // en resulteert tot een error van de API.
  CreateObjectToSend = (): IBestuurder => {
    let bestuurder = new Bestuurder;
    bestuurder.rijksregisternummer = this.bestuurderForm.controls["rijksregisternummer"].value.toString();
    bestuurder.naam = this.bestuurderForm.controls["naam"].value;
    bestuurder.achternaam = this.bestuurderForm.controls["achternaam"].value;
    bestuurder.geboorteDatum = new Date(this.bestuurderForm.controls["geboorteDatum"].value.toString());
    bestuurder.adres.straat = this.adresForm.controls["straat"].value;
    bestuurder.adres.huisnummer = this.adresForm.controls["huisnummer"].value;
    bestuurder.adres.postcode = this.adresForm.controls["postcode"].value;
    bestuurder.adres.stad = this.adresForm.controls["stad"].value;
    this.rijbewijsForm.controls["typeRijbewijs"].value.forEach((typeRijbewijs: any) => {
      let rij = this.rijbewijzen.find((v: Rijbewijs) => v.typeRijbewijs == typeRijbewijs);
      if (rij) {
        let toewijzingRijbewijs = new ToewijzingRijbewijs();
        toewijzingRijbewijs.rijbewijsId = rij.id;
        bestuurder.toewijzingenRijbewijs.push(toewijzingRijbewijs);
      }
    });

    return bestuurder;
  }

  private _autocomplete(value: string): Observable<void> {
    const filterValue = value.toLowerCase();
    return this.autocompleteList.filter((merk: string) => merk.toLowerCase().includes(filterValue));
  }

  private _autoCompleteDateOfBirth(value: string)  {
    if (value.length == 11) {
      let date = value.slice(0,6);
      let yearPart2 = date.slice(0,2);
      let month = date.slice(2,4);
      let day = date.slice(4,6);
      let yearPart1 = Number(yearPart2)-100 > 0 ? "20":"19";
       date = day.concat("/"+ month+"/"+19+yearPart2);

      // this.bestuurderForm.controls["geboorteDatum"].markAsTouched;
      // this.bestuurderForm.controls["geboorteDatum"].touched;
      this.bestuurderForm.controls["geboorteDatum"].setValue(date);

      console.log(this.bestuurderForm);
        }
  }
}

