/**
 * Deze interface wordt voornamelijk gebruikt op de data op te halen uit de database en als het ware te "patchen" met een object van het type Adres.
 */
export interface IAdres {

  /**
  * @ignore
  */
  straat: string;

  /**
  * @ignore
  */
  huisnummer: number;

  /**
  * @ignore
  */
  stad: string;

  /**
  * @ignore
  */
  postcode: number;
}
