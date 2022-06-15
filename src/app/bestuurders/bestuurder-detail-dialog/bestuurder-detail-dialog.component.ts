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
import { BestuurderDeleteConfirmationSheetComponent } from '../bestuurder-delete-confirmation-sheet/bestuurder-delete-confirmation-sheet.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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

 /**
 * indien een bestuurder.Adres wordt meegegeven door de parent (BestuurderListComponent) of door de DataExchangeService
 * wordt deze in deze variabele gegoten.
 *
 * [DataExchangeService]{@link DataExchangeService}
 */
  adres = new Adres();

  /**
  * Wordt opgevuld voor de autocomplete functie wanneer dat een postcode wordt ingevuld
  */
  autocompleteGemeenteList: any;

  /**
  * Wordt opgevuld voor de autocomplete functie wanneer dat een postcode wordt ingevuld
  */
  autocompleteStraatList: any;

   /**
   * Omvat alle geseede rijbewijzen uit de database.
   * wordt opgevuld tijdens OnInit.
   */
  rijbewijzen: Array<Rijbewijs> = [];

   /**
   * Omvat de lijst van alle Voertuigen die niet gelinkt zijn aan een bestuurder uit de database.
   * wordt opgevuld tijdens OnInit.
   */
  unlinkedVoertuigen: any;

     /**
   * Omvat de lijst van alle Tankkaarten die niet gelinkt zijn aan een bestuurder uit de database.
   * wordt opgevuld tijdens OnInit.
   */
  unlinkedTankkaarten: any;

   /**
   * Bevat de voertuig die gelinkt is aan de property bestuurder.
   * wordt geïnitialiseerd tijdens OnInit.
   */
  voertuigLink: any = null;

   /**
   * Bevat de tankkaart die gelinkt is aan de property bestuurder.
   * wordt geïnitialiseerd tijdens OnInit.
   */
  tankkaartLink: any = null;

 /**
   * Min Date for geboorteDatum datePicker (will be set to today)
   */
  minDate = new Date();

   /**
   * Max Date for geboorteDatum datePicker (will be set to today)
   */
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
    this.voertuigLink = data.voertuigLink;
    this.tankkaartLink = data.tankkaartLink;
  }


   /**
   * Behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
   * de benodigde properties weer te geven. Later worden deze terug omgezet in objecten.
   *
   * [CreateObjectToSend] {@link CreateObjectToSend()}
   */
  bestuurderForm = new FormGroup({
    rijksregisternummer: new FormControl('', [Validators.required, Validators.max(99999999999), Validators.min(10000000000)]),
    naam: new FormControl('', [Validators.required]),
    achternaam: new FormControl('', [Validators.required]),
    geboorteDatum: new FormControl('', [Validators.required])
  });

   /**
   * Behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
   * de benodigde properties weer te geven. Later worden deze terug omgezet in objecten.
   *
   * [CreateObjectToSend] {@link CreateObjectToSend()}
   */
  adresForm = new FormGroup({
    straat: new FormControl(''),
    huisnummer: new FormControl('', [Validators.min(1), Validators.max(999999)]),
    stad: new FormControl(''),
    postcode: new FormControl('', [Validators.min(1000), Validators.max(9999)]),
  });

 /**
   * Behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
   * de benodigde properties weer te geven. Later worden deze terug omgezet in objecten.
   *
   * [CreateObjectToSend] {@link CreateObjectToSend()}
   */
  rijbewijsForm = new FormGroup({
    typeRijbewijs: new FormControl(['', Validators.required])
  });

  ngOnInit(): void {

    //Disable van de velden, zodanig dat er verplicht eerst de postcode wordt ingevuld.
    this.adresForm.controls['stad'].disable();
    this.adresForm.controls['straat'].disable();
    this.adresForm.controls['huisnummer'].disable();

    //Vult de data op voor de datePicker van GeboorteDatum
    let year = moment().year();
    this.minDate = new Date('01/01/' + (year - 100));
    this.maxDate = moment().toDate();


    // zet de mode waarin de dialog zich op dit moment bevindt. de mogelijkheden zijn: boolean modifialbe.
    //Deze wordt meegegeven in de MAT_DIALOG_DATA bij opening van de dialog.
    this.IsModifiable(this.modifiable);

    //Haalt de geseede data van de rijbewijzen op en sorteert deze alfabetisch
    this.datastream.GetDriverLicences().subscribe((rijbewijs: any) => {
      this.rijbewijzen = rijbewijs;
      this.rijbewijzen.sort(function (a: any, b: any) {
        const typeA = a.typeRijbewijs;
        const typeB = b.typeRijbewijs;

        if (typeA < typeB)
          return -1

        if (typeA > typeB)
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
          if (data) {
            this.voertuigLink = data;
          }
          else {
            this.voertuigLink = undefined;
          }

          this.datastream.GetFuelCardsToLinkWithDriver(this.bestuurder.rijksregisternummer).subscribe((data: any) => {
            this.unlinkedTankkaarten = data;
            this.datastream.GetSingleFuelCard(this.bestuurder.koppeling.kaartnummer).subscribe((data: any) => {
              if (data) {
                this.tankkaartLink = data;
              }
              else {
                this.tankkaartLink = undefined;
              }
            });
          });
        });
      });
    }

    //Haalt de steden op nadat de postcode wordt ingevuld
    //Check op geldige postcode
    //deze geeft dan opties weer.
    this.adresForm.controls['postcode'].valueChanges.pipe(
      startWith(''),
      map(postcode => {
        if (postcode >= 1000 && postcode <= 9999 && (this.modifiable || this.forCreation)  ) {
          this.datastream.GetCityByPostalCode(postcode).subscribe((data: any) => {
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

    //Haalt de straten op nadat er 4 characters zijn ingevuld
    //deze geeft dan opties weer.
    this.adresForm.controls["straat"].valueChanges.pipe(
      startWith(''),
      map(value => {
        if (value.length >= 4 && (this.modifiable || this.forCreation) ) {
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


   /**
   * Omvat de creatie van het te verzenden object en de wissel van mode "add" naar "view" + errorbehandeling.
   */
  onSubmit = () => {
    let driver = this.CreateObjectToSend();
    this.datastream.PostDriver(driver).subscribe((res: any) => {
      if (res) {
        this.bestuurder = res;
        this.datastream.GetVehiclesForLinkingWithDriver(this.bestuurder.rijksregisternummer).subscribe((data: any) => {
          this.unlinkedVoertuigen = data;
        });
        this.patchObjectToForm(res);
      }
    }, error => {
        this.message.nativeElement.innerHTML = error.error;
      }, () => {
        this.IsModifiable(false);
        this.message.nativeElement.innerHTML = 'Nieuwe bestuurder met rijksregisternummer "' + this.bestuurder.rijksregisternummer + '" is successvol toegevoegd aan de database.';
      }
    );
  }


  /**
   * Past de modus voor modificatie van detailweergave naar editeren aan.
   */
  openUpdateScreen = () => {
    this.forCreation = false;
    this.IsModifiable(true);
    this.notEditable = "changeColor";
    this.viewOnly = "";
  }

  /**
   * Opent de geïnjecteerde instantie van de MatBottomSheetModule voor verwijdering van het bestuurder en definieert de te verwijderen entiteit.
   *
   * [BestuurderDeleteConfirmationSheetComponent] {@link BestuurderDeleteConfirmationSheetComponent}
   */
  openDeleteScreen = () => {
    const config = new MatBottomSheetConfig();
    config.autoFocus = true;
    config.disableClose = true;

    config.data = {
      entitytype: "bestuurder",
      entity: this.bestuurder
    };

    let bottomsheetRef = this.bottomSheet.open(BestuurderDeleteConfirmationSheetComponent, config);
    bottomsheetRef.afterDismissed().subscribe((deleted: boolean) => {
      if (deleted) {
        this.dialogRef.close();
      }
    });

  }


 /**
   * Aangezien mat-select werkt met een formcontrol en deze hier niet is aangemaakt omdat de voertuigLink een object omvat,
   *  implementeren we de selectie handmatig via een eventlistener.
   *
   * @param event
   *
   * @example
   *
   * <div class="formbuttons koppel field" *ngIf="viewOnly">
   <div *ngIf="!bestuurder.koppeling.chassisnummer" class="link-voertuig" appearance="fill">
   <mat-select (selectionChange)="onSelectionChangeVoertuig($event.value)">
   */
  onSelectionChangeVoertuig = (event: any) => {
    if (this.tankkaartLink != null) {
      this.unlinkedVoertuigen.filter((v: any) => v.brandstoffen)
    }

    let link = this.unlinkedVoertuigen.find((u: any) => u.chassisnummer == event);
    this.voertuigLink = link;
  }

   /**
   * Aangezien mat-select werkt met een formcontrol en deze hier niet is aangemaakt omdat de tankkaartLink een object omvat,
   *  implementeren we de selectie handmatig via een eventlistener.
   *
   * @param event
   *
   * @example
   *
   * <div class="formbuttons koppel field" *ngIf="viewOnly">
 <div *ngIf="!bestuurder.koppeling.kaartnummer" class="link-tankkaart" appearance="fill">
   <mat-select (selectionChange)="onSelectionChangeTankkaart($event.value)">
   */
  onSelectionChangeTankkaart = (event: any) => {
    if (this.voertuigLink != null) {
    }
    let link = this.unlinkedTankkaarten.find((u: any) => u.kaartnummer == event);
    this.tankkaartLink = link;
  }


  /**
   * Deze method opent bij het klikken op de gelinkte voertuig in de detail-dialog view mode, de view mode in de voertuigssectie van de applicatie van desbetreffende voertuig.
   * Eerst zorgen we ervoor dat de huidige dialog gesloten wordt, dan geven we via de data exchange service de opdracht om de view dialog te openen
   * en vervolgens navigeren we naar de voertuigssectie van de applicatie.
   *
   * {@link DataExchangeService}
   */
  OpenVoertuigenDetails = () => {
    this.dialogRef.close();
    this.dataService.sendData("voertuig", "view", this.voertuigLink);
    let navi = this.router.navigate(['/voertuigen']);
  }


    /**
   * Deze method opent bij het klikken op de gelinkte tankkaart in de detail-dialog view mode, de view mode in de tankkaartssectie van de applicatie van desbetreffende tankkaart.
   * Eerst zorgen we ervoor dat de huidige dialog gesloten wordt, dan geven we via de data exchange service de opdracht om de view dialog te openen
   * en vervolgens navigeren we naar de tankkaartssectie van de applicatie.
   *
   * {@link DataExchangeService}
   */
  OpenTankkaartenDetails = () => {
    this.dialogRef.close();
    this.dataService.sendData("tankkaart", "view", this.tankkaartLink);
    let navi = this.router.navigate(['/tankkaarten']);
  }

  /**
   * Slaat de veranderingen aan de entiteit op en patchet deze veranderingen op de entiteit.
   */
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

 /**
   * Koppelt of ontkoppelt en voertuig aan de entiteit.
   *
   * Omdat we enkel het correcte resultaat willen weergeven en deze in de tabel updaten voor geslaagde patch-bewerkingen naar de API,
   * gebruiken we de depricated manier van httpclient. + errormessagebehandeling.
   */
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


   /**
   * Koppelt of ontkoppelt en tankkaart aan de entiteit.
   *
   * Omdat we enkel het correcte resultaat willen weergeven en deze in de tabel updaten voor geslaagde patch-bewerkingen naar de API,
   * gebruiken we de depricated manier van httpclient. + errormessagebehandeling.
   */
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

  /**
   * behandelt de modus waarin de DialogComponent zich op dit moment bevindt.
   *
   * @param ismodifiable {boolean} boolean voor de check of de entiteit bewerkbaar is op dat moment.
   */
  IsModifiable = (ismodifiable: boolean) => {
    this.modifiable = ismodifiable
    if (!ismodifiable) {
      this.forCreation = false;
      this.notEditable = "changeColor";
      this.viewOnly = "changeColor";
    }
  }

   /**
   * indien een entiteit is meegegeven wordt deze via deze method gepatched met de Form(s).
   * De niet automatisch gepatchede controls worden handmatig ingegeven.
   *
   * @param entity de entiteit die in de form dient gegoten te worden.
   */
  patchObjectToForm = (entity: Bestuurder) => {

    if (this.bestuurder.rijbewijzen == undefined) {
      this.bestuurder.rijbewijzen = this.rijbewijzen;
    }

    this.adresForm.controls['stad'].enable();
    this.adresForm.controls['straat'].enable();
    this.adresForm.controls['huisnummer'].enable();

    this.bestuurderForm.patchValue(this.bestuurder);
    this.bestuurderForm.controls["geboorteDatum"].setValue(entity.geboorteDatum.toString());
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
    if (this.adresForm.controls["postcode"].value == 0) {
      this.adresForm.controls["postcode"].setValue("");
    }
    if (this.adresForm.controls["huisnummer"].value == 0) {
      this.adresForm.controls["huisnummer"].setValue("");
    }

    this.adresForm.patchValue(this.bestuurder.adres);
  }

   /**
   * Bereidt de entiteit voor voor verzending naar de back- end.
   * Elke property dient meegegeven te worden aan de api, null waardes voor getallen en strings kunnen niet verwerkt worden
   * en resulteert tot een error van de API.
   *
   * @returns new Entity();
   */
  CreateObjectToSend = (): IBestuurder => {
    let bestuurder = new Bestuurder;
    bestuurder.rijksregisternummer = this.bestuurderForm.controls["rijksregisternummer"].value.toString();
    bestuurder.naam = this.bestuurderForm.controls["naam"].value;
    bestuurder.achternaam = this.bestuurderForm.controls["achternaam"].value;
    bestuurder.adres.straat = this.adresForm.controls["straat"].value;
    bestuurder.adres.stad = this.adresForm.controls["stad"].value;

    if(!this.adresForm.controls["huisnummer"].value){
      this.adresForm.controls["huisnummer"].setValue(0);
    } else {
      bestuurder.adres.huisnummer = this.adresForm.controls["huisnummer"].value;
    }

    if(!this.adresForm.controls["postcode"].value){
      this.adresForm.controls["postcode"].setValue(0);
    } else {
      bestuurder.adres.huisnummer = this.adresForm.controls["postcode"].value;
    }

    let pipe = new DatePipe('en-GB');
    bestuurder.geboorteDatum = pipe.transform(this.bestuurderForm.controls["geboorteDatum"].value, 'yyyy-MM-dd') as unknown as Date;

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

