import * as moment from 'moment';
import { Component, Directive, ElementRef, Inject, ModuleWithComponentFactories, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../../datastream.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Bestuurder } from '../../objects/bestuurder';
import { DataExchangeService } from '../../data-exchange.service';
import { Adres } from 'src/app/objects/adres';
import { Observable } from 'rxjs';
import { IBestuurder } from 'src/app/objects/iBestuurder';
import { Rijbewijs } from 'src/app/objects/rijbewijs';
import { MAT_DATEPICKER_VALIDATORS } from '@angular/material/datepicker';
import { ToewijzingRijbewijs } from 'src/app/objects/toewijzingRijbewijs';


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
  bestuurderForm = this.formBuilder.group({
    rijksregisternummer: ['', [Validators.required, Validators.max(99999999999), Validators.min(9999999999)]],
    naam: ['', [Validators.required]],
    achternaam: ['', [Validators.required]],
    geboorteDatum: ['', MAT_DATEPICKER_VALIDATORS],
    typeRijbewijs: [null, Validators.required]
  });

  adresForm = new FormGroup({
    straat: new FormControl('', [Validators.required]),
    huisnummer: new FormControl('', [Validators.required, Validators.min(0), Validators.max(999999)]),
    stad: new FormControl('', [Validators.required]),
    postcode: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    let now = moment();
    this.minDate = new Date('01/01/1900');
    this.maxDate = now.toDate();

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
        this.unlinkedVoertuigen = data.filter((u: any) => u.koppeling == null || u.koppeling.chassisnummer == null)
      });
    } else {
      this.datastream.GetAllVehicles().subscribe((data: any) => {
        this.unlinkedVoertuigen = data.filter((u: any) => u.koppeling == null || u.koppeling.chassisnummer == null || u.koppeling.rijksregisternummer == this.bestuurder.rijksregisternummer);
        if (this.bestuurder) {
          if (this.bestuurder.koppeling) {
            let link = data.filter((u: any) => { u.koppeling != null && u.koppeling.rijksregisternummer == this.bestuurder.koppeling.rijksregisternummer });
            this.voertuigLink = link[0];
          }
        }
      });
    }

    // if (!this.bestuurder) {
    //   this.datastream.GetAllFuelCards().subscribe((data: any) => {
    //     this.unlinkedTankkaarten = data.filter((u: any) => u.koppeling.rijksregisternummer == null);
    //   });
    // } else {
    //   this.datastream.GetAllFuelCards().subscribe((data: any) => {
    //     this.unlinkedTankkaarten = data.filter((u: any) => u.koppeling.rijksregisternummer == null || u.koppeling.rijksregisternummer == this.bestuurder.rijksregisternummer);
    //     if (this.bestuurder) {
    //       if (this.bestuurder.koppeling) {
    //         let link = data.filter((u: any) => u.koppeling.rijksregisternummer == this.bestuurder.rijksregisternummer);
    //         if (link != null) {
    //           this.tankkaartLink = link[0];
    //         }
    //       }
    //     }
    //   });
    // }

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
  IsModifiable = (ismodifiable: boolean) => {
    this.modifiable = ismodifiable
    if (!ismodifiable) {
      this.forCreation = false;
      this.notEditable = "changeColor";
      this.viewOnly ="changeColor";
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
      // this.bestuurderForm.controls["typeRijbewijs"].markAsTouched;
      this.bestuurderForm.controls["typeRijbewijs"].setValue(dataArray);
    }
    // this.bestuurderForm.controls["typeBrandstof"].setValue(this.bestuurderForm.adres.typeBrandstof);

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
    this.bestuurderForm.controls["typeRijbewijs"].value.forEach((typeRijbewijs: any) => {
      let rij = this.rijbewijzen.find((v: Rijbewijs) => v.typeRijbewijs == typeRijbewijs);
      if (rij) {
        let toewijzingRijbewijs = new ToewijzingRijbewijs();
        toewijzingRijbewijs.rijbewijsId = rij.id;
        bestuurder.toewijzingenRijbewijs.push(toewijzingRijbewijs);
      }
    });

    return bestuurder;
  }

  private _autocomplete(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autocompleteList.filter((merk: string) => merk.toLowerCase().includes(filterValue));
  }
}
