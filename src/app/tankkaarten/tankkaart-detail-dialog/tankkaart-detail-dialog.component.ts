import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DatastreamService} from '../../datastream.service';
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Tankkaart} from "../../objects/tankkaart";
import {ITankkaart} from "../../objects/iTankkaart";
import {DataExchangeService} from '../../data-exchange.service';
import {MatBottomSheet, MatBottomSheetConfig} from '@angular/material/bottom-sheet';
import {TankkaartDeleteConfirmationSheetComponent} from "../tankkaart-delete-confirmation-sheet/tankkaart-delete-confirmation-sheet.component";
import {Brandstof} from "../../objects/brandstof";
import {mogelijkeBrandstof} from "../../objects/mogelijkeBrandstof";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tankkaart-detail-dialog',
  templateUrl: './tankkaart-detail-dialog.component.html',
  styleUrls: ['./tankkaart-detail-dialog.component.css'],
})

export class TankkaartDetailDialogComponent implements OnInit {

  /**
   * ngClass
   *
   * HTML Class voor het omschrijven van gebeurtenissen gericht naar de gebruiker.
   *
   * @return {string} message (nullable)   dynamisch gegenereerd bericht.
   */
  @ViewChild('message', { static: false}) message!: ElementRef;

  /**
   * ngModel
   *
   * modifiable behandelt de modus waarin de input van een tankkaart kan aangepast worden.
   */
  modifiable: boolean = true;

  /**
   * ngModel
   *
   * forCreation behandelt de modus waarin de input van een tankkaart kan aangemaakt worden.
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
   * ngClass
   *
   * hide verbergt de pincode
   */
  hide: boolean = true;

  /**
   * indien een tankkaart wordt meegegeven door de parent (TankkaartListComponent) of door de DataExchangeService
   * wordt deze in deze variabele gegoten.
   *
   * [DataExchangeService]{@link DataExchangeService}
   */
  tankkaart = new Tankkaart();

  /**
   * Omvat alle geseede brandstoftypes uit de database.
   * wordt opgevuld tijdens OnInit.
   */
  KeuzeBrandstoffen: any;

  /**
   * Omvat de lijst van alle Bestuurders die niet gelinkt zijn aan een tankkaart uit de database.
   * wordt opgevuld tijdens OnInit.
   */
  unlinkedBestuurders: any;

  /**
   * Bevat de bestuurder die gelinkt is aan de property tankkaart.
   * wordt geïnitialiseerd tijdens OnInit.
   */
  bestuurderLink: any = null;

  /**
   * Template voor brandstof
   */
  brandstof={
    id: "",
    typeBrandstof: ""
  };

  /**
   * Min Date for geldigheidsdatum datePicker (will be set to today)
   */
  minDate: Date = new Date();

  /**
   * Behandelt de validatie en controls van de inputs en selects. Bij objecten is het raadzaam deze te flattenen of enkel
   * de benodigde properties weer te geven. Later worden deze terug omgezet in objecten.
   *
   * [CreateObjectToSend] {@link CreateObjectToSend()}
   */
  tankkaartForm = new FormGroup({
    kaartnummer: new FormControl('',[Validators.required, Validators.pattern("[0-9]{15,21}")]),
    geldigheidsdatum: new FormControl('',[Validators.required]),
    pincode: new FormControl('',[Validators.pattern("[0-9]{4}")]),
    isGeblokkeerd: new FormControl(false,[Validators.required]),
    typeBrandstof: new FormControl('',),
  });

  /**
   * @param datastream Httpclient naar de back- end toe.
   * @param dialogRef referentie naar het dialog venster zelf.
   * @param dataService Service voor het behandelen van data tussen componenten zonder parent - child relatie.
   * @param bottomSheet instantie nodig voor de initialisatie van het BottomsheetComponent.
   * @param router instantie die de routes van de applicatie verzorgt.
   * @param data {any} de data die wordt meegegeven bij het openen van het dialogvenster.
   */
  constructor(private datastream: DatastreamService,
              private dialogRef: MatDialogRef<TankkaartDetailDialogComponent>,
              private dataService: DataExchangeService,
              private bottomSheet: MatBottomSheet,
              private router: Router,
              @Inject(MAT_DIALOG_DATA) private data: any) {
    this.tankkaart = data.entity;
    this.modifiable = data.modifiable;
    this.bestuurderLink = data.bestuurderLink;
  }

  ngOnInit(): void {

    // Indien de tankkaart gekend is, dan is dat de minimum datum, anders vandaag.
    if ( this.tankkaart != null) {
      this.minDate = this.tankkaart.geldigheidsDatum;
    }

    //We kijken of er een object wordt meegegeven via MAT_DIALOG_DATA.
    // Indien ja, patchen we deze in de form.
    if (this.tankkaart) {
      this.patchObjectToForm(this.tankkaart);
    }

    // zet de mode waarin de dialog zich op dit moment bevindt.
    //Deze wordt meegegeven in de MAT_DIALOG_DATA bij opening van de dialog.
    this.IsModifiable(this.modifiable);

    // Ophalen van de brandstoffen om te kunnen toevoegen aan de brandstof
    this.datastream.GetFuels().subscribe((data: any) => {
      this.KeuzeBrandstoffen = data;
    });

    // We hebben voor de koppeling met bestuurders enkel de bestuurders nodig zonder koppeling met de entiteit
    //+ de bestuurder die al dan niet reeds gekoppeld is met de entiteit. deze worden opgeslagen in unlinkedBestuurders
    //en de bestuurder van de koppeling in de var. bestuurderLink.
    if (this.tankkaart) {
      this.datastream.GetDriversToLinkWithFuelCard(this.tankkaart.kaartnummer).subscribe((data: any) => {
        this.unlinkedBestuurders = data;
      });
    }


    //listener voor het sluiten van de dialog + transfer object naar de tabel.
    this.dialogRef.backdropClick().subscribe(() => {
      this.dialogRef.close(this.tankkaart);
    });
  }

  /**
   * Omvat de creatie van het te verzenden object en de wissel van mode "add" naar "view" + errorbehandeling.
   */
  onSubmit = () => {

    let fuelcard = this.CreateObjectToSend();

    this.datastream.PostFuelCard(fuelcard).subscribe((res: any) => {
      if (res) {
        this.tankkaart = res;
        this.datastream.GetDriversToLinkWithFuelCard(this.tankkaart.kaartnummer).subscribe((data: any) => {
          this.unlinkedBestuurders = data;
        });
      }
    }, error => {
      this.message.nativeElement.innerHTML = error.error;
    }, () => {
      this.IsModifiable(false);
      this.message.nativeElement.innerHTML = 'Nieuwe tankkaart met kaartnummer "' + this.tankkaart.kaartnummer + '" is successvol toegevoegd aan de database.';
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
   * Opent de geïnjecteerde instantie van de MatBottomSheetModule voor verwijdering van het voertuig en definieert de te verwijderen entiteit.
   *
   * [DeleteConfirmationSheetComponent] {@link DeleteConfirmationSheetComponent}
   */
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

  /**
   * Aangezien mat-select werkt met een formcontrol en deze hier niet is aangemaakt omdat de bestuurderLink een object omvat,
   *  implementeren we de selectie handmatig via een eventlistener.
   *
   * @param event
   *
   * @example
   *
   * <div class="formbuttons koppel field" *ngIf="viewOnly">
   <mat-form-field *ngIf="!voertuig.koppeling" class="link-bestuurder" appearance="fill">
   <mat-select (selectionChange)="onSelectionChange($event.value)">
   */
  onSelectionChange = (event: any) => {
    let link = this.unlinkedBestuurders.filter((u: any) => u.rijksregisternummer == event);
    this.bestuurderLink = link[0];
  }

  /**
   * Deze method opent bij het klikken op de gelinkte bestuurder in de detail-dialog view mode, de view mode in de bestuurdersectie van de applicatie van desbetreffende bestuurder.
   * Eerst zorgen we ervoor dat de huidige dialog gesloten wordt, dan geven we via de data exchange service de opdracht om de view dialog te openen
   * en vervolgens navigeren we naar de bestuurderssectie van de applicatie.
   *
   * {@link DataExchangeService}
   */
  OpenBestuurdersDetails(): void {
    this.dialogRef.close();
    this.dataService.sendData("bestuurder","view", this.bestuurderLink);
    let navi =this.router.navigate(['/bestuurders']);
  }

  /**
   * Slaat de veranderingen aan de entiteit op en patched deze veranderingen op de entiteit.
   */
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

  /**
   * Koppelt of ontkoppelt en bestuurder aan de entiteit.
   *
   * Omdat we enkel het correcte resultaat willen weergeven en deze in de tabel updaten voor geslaagde patch-bewerkingen naar de API,
   * gebruiken we de depricated manier van httpclient. + errormessagebehandeling.
   */
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

  /**
   * behandelt de modus waarin de DialogComponent zich op dit moment bevindt.
   *
   * @param ismodifiable {boolean} boolean voor de check of de entiteit bewerkbaar is op dat moment.
   */
  IsModifiable = (ismodifiable: boolean) =>{
    this.modifiable = ismodifiable
    if(!ismodifiable){
      this.forCreation = false;
      this.notEditable = "changeColor";
      this.viewOnly ="changeColor";
    }
  }

  /**
   * indien een entiteit is meegegeven wordt deze via deze method gepatched met de Form(s).
   * De niet automatisch gepatchede controls worden handmatig ingegeven.
   *
   * Manueel: geldigheidsDatum, mogelijkeBrandstoffen en pincode (0=geen)
   *
   * @param entity de entiteit die in de form dient gegoten te worden.
   */
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
    if (this.tankkaart.pincode == 0) {
      this.tankkaartForm.controls["pincode"].setValue("");
    }
  }

  /**
   * Bereidt de entiteit voor voor verzending naar de back- end.
   * Elke property dient meegegeven te worden aan de api, null waardes voor getallen en strings kunnen niet verwerkt worden
   * en resulteert tot een error van de API.
   *
   * Pincode: default 9999
   * MogelijkeBrandstoffen: opbouw van de brandstoffen lijst in de mogelijke brandstoffen
   *
   * @returns new Entity();
   */
  CreateObjectToSend =(): ITankkaart => {
    let fuelcard = new Tankkaart();

    fuelcard.kaartnummer = this.tankkaartForm.controls["kaartnummer"].value;
    fuelcard.geldigheidsDatum = this.tankkaartForm.controls["geldigheidsdatum"].value;
    fuelcard.isGeblokkeerd = this.tankkaartForm.controls["isGeblokkeerd"].value;

    if(!this.tankkaartForm.controls["pincode"].value){
      this.tankkaartForm.controls["pincode"].setValue(0);
    } else {
      fuelcard.pincode = parseInt(this.tankkaartForm.controls["pincode"].value, 10) ;
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

    console.log(fuelcard);

    return fuelcard;
  }
}
