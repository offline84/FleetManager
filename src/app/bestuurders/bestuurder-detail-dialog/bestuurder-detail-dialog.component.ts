import * as moment from 'moment';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatastreamService } from '../../datastream.service';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms'
import { Bestuurder } from '../../objects/bestuurder';
import { DataExchangeService } from '../../data-exchange.service';
import { Adres } from 'src/app/objects/adres';
import { map, Observable, startWith } from 'rxjs';
import { IBestuurder } from 'src/app/objects/iBestuurder';
import { Rijbewijs } from 'src/app/objects/rijbewijs';
import { ToewijzingRijbewijs } from 'src/app/objects/toewijzingRijbewijs';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { DeleteConfirmationSheetComponent } from '../bestuurder-delete-confirmation-sheet/bestuurder-delete-confirmation-sheet.component';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-bestuurder-detail-dialog',
  templateUrl: './bestuurder-detail-dialog.component.html',
  styleUrls: ['./bestuurder-detail-dialog.component.css']
})

export class BestuurderDetailDialogComponent implements OnInit {

  /**
    * ngClass
    *
    * HTML Class voor het omschrijven van gebeurtenissen gericht naar de gebruiker.
    *
    * @return {string} message (nullable)   dynamisch gegenereerd bericht.
    */
  @ViewChild('message', { static: false }) message!: ElementRef;

  /**
 * ngModel
 *
 * modifiable behandelt de modus waarin de input van een voertuig kan aangepast worden.
 */
  modifiable: boolean = true;

  /**
  * ngModel
  *
  * forCreation behandelt de modus waarin de input van een voertuig kan aangemaakt worden.
  */
  forCreation: boolean = true;

  /**
  * ngclass
  *
  * notEditable verandert de kleur van niet aanpasbare input naar CSS class changeColor
  *
  * @example
  * forCreation = false
  * modifiable = true
  * notEditable = "changeColor"       => kleur van input = grijs
  */
  notEditable!: string;

  /**
   * ngClass
   *
   * viewOnly verandert de kleur van niet aanpasbare input naar CSS class changeColor
   *
   * @example
   * modifiable = false
   * forCreation = false
   * viewOnly = "changeColor"           => kleur van input = grijs
   */
  viewOnly!: string;



  /**
 * indien een bestuurder wordt meegegeven door de parent (BestuurderListComponent) of door de DataExchangeService
 * wordt deze in deze variabele gegoten.
 *
 * [DataExchangeService]{@link DataExchangeService}
 */
  bestuurder = new Bestuurder();

  adres = new Adres();
  autocompleteList: any;
  autocompleteGemeenteList: any;
  autocompleteStraatList: any;
  rijbewijzen: Array<Rijbewijs> = [];
  unlinkedVoertuigen: any;
  unlinkedTankkaarten: any;
  voertuigLink: any = null;
  tankkaartLink: any = null;
  autocompleteOptions: Observable<string[]> = new Observable<string[]>();



  minDate = new Date();
  maxDate = new Date();

  /**
     * @param datastream Httpclient naar de back- end toe.
     * @param dialogRef referentie naar het dialog venster zelf.
     * @param dataService Service voor het behandelen van data tussen componenten zonder parent - child relatie.
     * @param bottomSheet instantie nodig voor de initialisatie van het BottomsheetComponent.
     * @param router instantie die de routes van de applicatie verzorgt.
     * @param data {any} de data die wordt meegegeven bij het openen van het dialogvenster.
     */
  constructor(private datastream: DatastreamService,
    private dialogRef: MatDialogRef<BestuurderDetailDialogComponent>,
    private dataService: DataExchangeService,
    private bottomSheet: MatBottomSheet,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
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
    this.adresForm.controls['stad'].disable();
    this.adresForm.controls['straat'].disable();
    this.adresForm.controls['huisnummer'].disable();
    let year = moment().year();
    this.minDate = new Date('01/01/' + (year - 100));
    this.maxDate = moment().toDate();


    // zet de mode waarin de dialog zich op dit moment bevindt. de mogelijkheden zijn: boolean modifialbe.
    //Deze wordt meegegeven in de MAT_DIALOG_DATA bij opening van de dialog.
    this.IsModifiable(this.modifiable);

    this.datastream.GetDriverLicences().subscribe((rijbewijs: any) => {
      this.rijbewijzen = rijbewijs;
    });

    // We hebben voor de koppeling met bestuurders enkel de bestuurders nodig zonder koppeling met de entiteit
    //+ de bestuurder die al dan niet reeds gekoppeld is met de entiteit. deze worden opgeslagen in unlinkedVoertuigen
    //en de bestuurder van de koppeling in de var. voertuigLink.
    if (!this.bestuurder) {
      this.datastream.GetAllVehicles().subscribe((data: any) => {
        this.unlinkedVoertuigen = data.filter((u: any) => u.koppeling == null)
      });
    } else {
      this.datastream.GetAllVehicles().subscribe((data: any) => {
        this.unlinkedVoertuigen = data.filter((voertuig: any) => voertuig.koppeling == null || this.bestuurder.koppeling.chassisnummer == voertuig.chassisnummer);
        if (this.bestuurder) {
          if (this.bestuurder.koppeling) {
            let link = data.filter((voertuig: any) => voertuig.chassisnummer == this.bestuurder.koppeling.chassisnummer);
            if (link) {
              this.voertuigLink = link[0];
            }
          }
        }
      });
    }

    if (!this.bestuurder) {
      this.datastream.GetAllFuelCards().subscribe((data: any) => {
        this.unlinkedTankkaarten = data.filter((u: any) => u.koppeling == null)
      });
    } else {
      this.datastream.GetAllFuelCards().subscribe((data: any) => {
        this.unlinkedTankkaarten = data.filter((tankkaart: any) => tankkaart.koppeling == null || this.bestuurder.koppeling.kaartnummer == tankkaart.kaartnummer);
        if (this.bestuurder) {
          if (this.bestuurder.koppeling) {
            let link = data.filter((tankkaart: any) => tankkaart.kaartnummer == this.bestuurder.koppeling.kaartnummer);
            this.tankkaartLink = link[0];
          }
        }
      });
    }

    this.adresForm.controls["postcode"].valueChanges.pipe(
      startWith(''),
      map(value => {
        if (value >= 1000 && value <= 9999) {
          this.datastream.GetCityByPostalCode(value).subscribe((data: any) => {
            let list = data.postnamen;
            this.autocompleteGemeenteList = list.map((s: any) => s.geografischeNaam.spelling);
            this.adresForm.controls['stad'].enable();
            this.adresForm.controls['straat'].enable();
          })
        } else {
          this.adresForm.controls['stad'].disable();
          this.adresForm.controls['straat'].disable();
        }
      })).subscribe();

    this.adresForm.controls["straat"].valueChanges.pipe(
      startWith(''),
      map(value => {
        if (value.length >= 4) {
          this.datastream.GetStreetNameByPostalcodeAndQuery(this.adresForm.controls['postcode'].value, value).subscribe((straten: any) => {
            let list = Array.isArray(straten.adresMatches) ? straten.adresMatches.filter((straat: any) => {
              return straat
            }) : [];
            this.autocompleteStraatList = list.map((s: any) => s.straatnaam.straatnaam.geografischeNaam.spelling);
            this.adresForm.controls['huisnummer'].enable();
          })
        } else {
          this.adresForm.controls['huisnummer'].disable();
        }
      })).subscribe();


    // We kijken of er een object wordt meegegeven via MAT_DIALOG_DATA.
    // Indien ja, patchen we deze in de form.
    if (this.bestuurder) {

      this.patchObjectToForm(this.bestuurder);
    };



    //listener voor het sluiten van de dialog + transfer object naar de tabel.
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(this.bestuurder);
    });
  }



  //Omvat de creatie van het te verzenden object en de wissel van mode "add" naar "view" + errorbehandeling.
  onSubmit = () => {
    if (this.bestuurderForm.valid && this.rijbewijsForm.valid) {

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
      entitytype: "bestuurder",
      entity: this.bestuurder
    };

    let bottomsheetRef = this.bottomSheet.open(DeleteConfirmationSheetComponent, config);
    bottomsheetRef.afterDismissed().subscribe((deleted: boolean) => {
      if (deleted) {
        this.dialogRef.close();
      }
    });

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
    this.dialogRef.close();
    this.dataService.sendData("voertuig", "view", this.voertuigLink);
    let navi = this.router.navigate(['/voertuigen']);
  }


  OpenTankkaartenDetails = () => {
    this.dialogRef.close();
    this.dataService.sendData("tankkaart", "view", this.voertuigLink);
    let navi = this.router.navigate(['/tankkaarten']);
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
      if (this.bestuurder.koppeling.kaartnummer) {
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

    if (this.bestuurder.rijbewijzen == undefined) {
      this.bestuurder.rijbewijzen = this.rijbewijzen;
    }

    this.adresForm.controls['stad'].enable();
    this.adresForm.controls['straat'].enable();
    this.adresForm.controls['huisnummer'].enable();

    this.bestuurderForm.patchValue(this.bestuurder);
    if (this.bestuurder.toewijzingenRijbewijs != null) {
      let dataArray: string[] = [];
      this.bestuurder.toewijzingenRijbewijs.forEach(toewijzing => {
        var rijbewijs = this.bestuurder.rijbewijzen.find((r: Rijbewijs) => r.id == toewijzing.rijbewijsId);
        if (rijbewijs) {
          dataArray.push(rijbewijs.typeRijbewijs);
        }
      });
      this.rijbewijsForm.controls['typeRijbewijs'].setValue(dataArray);
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
    bestuurder.geboorteDatum = new Date(this.bestuurderForm.controls["geboorteDatum"].value);
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


}

