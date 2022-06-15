import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


/**
 * De DatastreamService haalt de data op uit de databank van de API. Aangezien deze data async binnenkomt is het
 * raadzaam gebruik te maken van abonnementen (zie observer pattern, gang of four).
 */
export class DatastreamService {

  /**
   * bevat de connectiestring naar de API. Wordt geïnitialiseerd via de constructor.
   */
  private connectionstring: string;

  /**
   * bevat de connectiestring naar de open API van basisregisters vlaanderen. Wordt geïnitialiseerd via de constructor.
   * deze Api bevat informatie over adressen, nodig voor autocomplete in de BestuurderDetailDialogComponent.
   *
   * {@link https://docs.basisregisters.vlaanderen.be/docs/api-documentation.html#operation/ListPostalCodes}
   */
  private adresApiUrl: string;


  /**
   *Hier wordt de API- connectiestring geïnjecteerd d.m.v. de provider in ngModule. Indien men de
   *connectiestring naar de API wil veranderen dient deze ginds aangepast te worden.
   * @param http  verzorgt de crud operaties naar de API toe.
   * @param _connectionstring Wordt geïnjecteerd via de provider in app.module.ts en bevat de connectiestring naar de API.
   * @param _adresAPI Wordt geïnjecteerd via de provider in app.module.ts en bevat de connectiestring naar de open API "basisregisters vlaanderen".
   */
  constructor( private http: HttpClient, @Inject("API_Url") _connectionstring: string, @Inject("Adres_API_Url") _adresAPI: string) {
    this.connectionstring = _connectionstring;
    this.adresApiUrl = _adresAPI;
  }

  //#region Voertuigen

  /**
   * Haalt alle niet gearchiveerde voertuigen op uit de database.
   * @returns Voertuigen[]
   */
  GetAllVehicles = () => {
    return this.http.get(this.connectionstring + "voertuig/active");
  }

  /**
   * Haalt een voertuig op uit de database a.d.h.v. het chassisnummer.
   * @param vehicleId chassisnummer van het voertuig dat men opvragen wil.
   * @returns Voertuig
   */
  GetSingleVehicle = (vehicleId: string) => {
    return this.http.get(this.connectionstring + "voertuig/" + vehicleId);
  }

  /**
   * Haalt alle statussen op uit de database
   * @returns Statussen[]
   */
  GetStatusses = () => {
    return this.http.get(this.connectionstring + "voertuig/statusses");
  }

  /**
   * Haalt alle categorien op uit de database
   * @returns Categories[]
   */
  GetCategories = () => {
    return this.http.get(this.connectionstring + "voertuig/categories");
  }

  /**
   * Haalt alle brandstoffen op uit de database
   * @returns Brandstoffen[]
   */
  GetFuels = () => {
    return this.http.get(this.connectionstring + "voertuig/brandstoffen");
  }

  GetVehiclesForLinkingWithDriver = (rijksregisternummer: string) => {
    let params = new HttpParams().set("rijksregisternummer", rijksregisternummer);

    return this.http.get(this.connectionstring + "voertuig/bestuurder", {params});
  }

  /**
   * Maakt een nieuw voertuig aan in de database.
   * @param voertuig object van het type Voertuig
   * @returns undefined, error
   */
  PostVehicle = (voertuig: any) => {
    return this.http.post(this.connectionstring + "voertuig", voertuig).pipe(catchError(this.handleError));
  }

  /**
   * bewerkt een voertuig uit de database. Veranderingen aan het chassisnummer is niet mogelijk.
   *
   * @param voertuig object van het type Voertuig
   * @returns undefined, error
   */
  UpdateVehicle = (voertuig: any) => {
    return this.http.patch(this.connectionstring + "voertuig/update", voertuig).pipe(catchError(this.handleError));
  }

  /**
   * archiveert een voertuig uit de database. enkel administratoren kunnen deze bewerking ongedaan maken.
   *
   * @param vehicleId het chassisnummer van het voertuig
   * @returns undefined
   */
  DeleteVehicle = (vehicleId: string) =>{
    return this.http.delete(this.connectionstring +"voertuig/" + vehicleId);
  }
  //#endregion Voertuigen

  //#region Bestuurders

  /**
   * Haalt alle niet gearchiveerde bestuurders op uit de database.
   * @returns Bestuurders[]
   */
  GetAllDrivers = () => {
    return this.http.get(this.connectionstring + "bestuurder/active");
  }

    /**
   * Haalt alle rijbewijzen op uit de database.
   * @returns Bestuurders[]
   */
  GetDriverLicences = () => {
    return this.http.get(this.connectionstring + "bestuurder/rijbewijzen");
  }

  /**
   * Haalt een bestuurder op uit de database a.d.h.v. het rijksregisternummer.
   * @param rijksregisternummer van de bestuurder dat men opvragen wil.
   * @returns bestuurder
   */
  GetSingleDriver = (rijksregisternummer: string) => {
    return this.http.get(this.connectionstring + "bestuurder/" + rijksregisternummer);
  }

  /**
   * Haalt een bestuurder op uit de database a.d.h.v. het chassisnummer en typeBrandstof.
   * @param chassisnummer van de voertuig dat men opvragen wil.
   * @param typeBrandstof van de voertuig dat men opvragen wil.
   * @returns bestuurder
   */
  GetDriversToLinkWithVehicle = (chassisnummer: string, typeBrandstof: string) => {
    let params = new HttpParams()
        .set('chassisnummer', chassisnummer)
        .set('typeBrandstof', typeBrandstof);

        return this.http.get(this.connectionstring + "bestuurder/voertuig", {params});
  }

    /**
   * Haalt een bestuurder op uit de database a.d.h.v. het kaartnummer.
   * @param kaartnummer van de tankkaart dat men opvragen wil.
   * @returns bestuurder
   */
  GetDriversToLinkWithFuelCard = (kaartnummer: string) => {
    let params = new HttpParams()
      .set('kaartnummer', kaartnummer);

    return this.http.get(this.connectionstring + "bestuurder/tankkaart", {params});
  }

  /**
   * Maakt een nieuw bestuurder aan in de database.
   * @param bestuurder object van het type Bestuurder
   * @returns undefined, error
   */
  PostDriver = (bestuurder: any) => {
    return this.http.post(this.connectionstring + "bestuurder", bestuurder).pipe(catchError(this.handleError));
  }

    /**
   * bewerkt een bestuurder uit de database. Veranderingen aan het rijksregisternummer is niet mogelijk.
   * Aangezien we ervan uit gaan dat een rijksregisternummer uniek is.
   * Indien nodig kan er een nieuwe bestuurder toegevoegd worden.
   *
   * @param bestuurder object van het type Bestuurder
   * @returns undefined, error
   */
  UpdateDriver = (bestuurder: any) => {
    return this.http.patch(this.connectionstring + "bestuurder/update", bestuurder).pipe(catchError(this.handleError));
  }

   /**
   * archiveert een bestuurde uit de database. enkel administratoren kunnen deze bewerking ongedaan maken.
   *
   * @param id het rijksregisternummer van het bestuurder
   * @returns undefined
   */
  DeleteBestuurder = (id: string) =>{
    return this.http.delete(this.connectionstring +"bestuurder/" + id);
  }
  //#endregion Bestuurders

  //#region Tankkaarten
  /**
   * Haalt alle niet gearchiveerde tankkaarten op uit de database.
   * @returns Tankkaarten[]
   */
  GetAllFuelCards = () => {
    return this.http.get(this.connectionstring + "tankkaart/active");
  }

  /**
   * Haalt een tankkaart op uit de database a.d.h.v. het kaartnummer.
   * @param tankkaartId chassisnummer van het voertuig dat men opvragen wil.
   * @returns Tankkaart
   */
  GetSingleFuelCard = (tankkaartId: string) => {
    return this.http.get(this.connectionstring + "tankkaart/" + tankkaartId);
  }

  GetFuelCardsToLinkWithDriver = (rijksregisternummer: string) => {
    let params = new HttpParams().set("rijksregisternummer", rijksregisternummer);

    return this.http.get(this.connectionstring + "tankkaart/bestuurder", {params});
  }

  /**
   * Maakt een nieuwe tankkaart aan in de database.
   * @param tankkaart object van het type Tankkaart
   * @returns undefined, error
   */
  PostFuelCard = (tankkaart: any) => {
    return this.http.post(this.connectionstring + "tankkaart", tankkaart).pipe(catchError(this.handleError));
  }

  /**
   * bewerkt een tankkaart uit de database. Veranderingen aan het kaartnummer is niet mogelijk.
   *
   * @param tankkaart object van het type Tankkaart
   * @returns undefined, error
   */
  UpdateFuelCard  = (tankkaart: any) => {
    return this.http.patch(this.connectionstring + "tankkaart/update", tankkaart).pipe(catchError(this.handleError));
  }

  /**
   * archiveert een tankkaart uit de database. enkel administratoren kunnen deze bewerking ongedaan maken.
   *
   * @param tankkaartId het chassisnummer van de tankkaart
   * @returns undefined
   */
  DeleteFuelCard = (tankkaartId: string) => {
    return this.http.delete(this.connectionstring + "tankkaart/delete/" + tankkaartId);
  }

  //#endregion Tankkaarten


  //#region Koppelingen

  /**
   * koppelt een voertuig los van de bestuurder.
   *
   * @param vehicleId het chassisnummer van het los te koppelen voertuig.
   * @returns null
   */
  UnlinkVehicle = (vehicleId: string) => {
    return this.http.patch(this.connectionstring + "voertuig/koppellos/" + vehicleId, null).pipe(catchError(this.handleError));
  }

  /**
   * Koppelt een bestuurder aan een voertuig.
   *
   * @param idNumber het rijksregisternummer van een bestuurder.
   * @param vehicleId het chassisnummer van het te koppelen voertuig.
   * @returns null
   */
  LinkVehicle = ( idNumber: string, vehicleId: string) => {
    return this.http.patch(this.connectionstring + "voertuig/koppel/" + idNumber + "/" + vehicleId, null).pipe(catchError(this.handleError));
  }

  /**
   * koppelt een tankkaart los van de bestuurder.
   *
   * @param tankkaartId het chassisnummer van de los te koppelen tankkaart.
   * @returns null
   */
  UnlinkFuelCard = (tankkaartId: string) => {
    return this.http.get(this.connectionstring + "tankkaart/koppellos/" + tankkaartId).pipe(catchError(this.handleError));
  }

  /**
   * Koppelt een bestuurder aan een tankkaart.
   *
   * @param idNumber het rijksregisternummer van een bestuurder.
   * @param tankkaartId het chassisnummer van het te koppelen tankkaart.
   * @returns null
   */
  LinkFuelCard = ( idNumber: string, tankkaartId: string) => {
    return this.http.get(this.connectionstring + "tankkaart/koppel/" + idNumber + "/" + tankkaartId).pipe(catchError(this.handleError));
  }

  //#endregion Koppelingen

  //#region OpenApi

    /**
     * zoekt de naam van de gemeente op waarbij meegegeven postcode behoort.
     *
     * @param postalCode de postcode van de gemeente
     * @returns lijst van objecten met gemeentes passend bij de meegegeven postcode.
     */
    GetCityByPostalCode = (postalCode: string) => {
      return this.http.get(this.adresApiUrl + "/postinfo/" + postalCode);
    }

    /**
     * Zoekt naar een straatnaam als deze minstens 4 tekens bevat.
     * De postcode dient steeds meegegeven te worden.
     *
     * @param postalCode de postcode van de gemeente waarin men een adres wil zoeken.
     * @param streetQuery een deel of de volledige straatnaam.
     * @returns lijst van objecten die straatnamen bevatten passend bij de query.
     */
    GetStreetNameByPostalcodeAndQuery = (postalCode: string, streetQuery: string) => {
      let params = new HttpParams()
        .set('postcode', postalCode)
        .set('straatnaam', streetQuery);

      return this.http.get(this.adresApiUrl + "/adresmatch", {params});
    }
  //#endregion OpenApi


  /**
   * Zorgt ervoor dat de error zichtbaar is in de logfiles.
   *
   * @example
   * if (error.status === 0) {
   *  console.error('An error occurred:', error.error);       => client side error
   *
   * @example
   * else {
   *  console.error(
   *     `Backend returned code ${error.status}, body was: `, error.error);       => server side error
   * }
   *
   * @example
   * return throwError(() => error);          => error with response body
   *
   * @param error is de HttpErrorResponse die bij fout in verzending meegegeven wordt aan de HttpResponse.
   * @returns Observable van de error voor admin gerichte berichten.
   */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {

      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => error);
  }
}
