import { Adres } from "./adres";
import { Rijbewijs } from "./rijbewijs";
import { ToewijzingRijbewijs } from "./toewijzingRijbewijs";

/**
 * Deze interface wordt voornamelijk gebruikt op de data op te halen uit de database en als het ware te "patchen" met een object van het type Bestuurder.
 * Bevat Adres, ToewijzingRijbewijs, Rijbewijs. 
*/
export interface IBestuurder {

  /**
 * @ignore
 */
  rijksregisternummer: string;

  /**
 * @ignore
 */
  naam: string;

  /**
 * @ignore
 */
  achternaam: string;

  /**
 * @ignore
 */
  adres: Adres;

  /**
 * @ignore
 */
  koppeling: any;

  /**
 * @ignore
 */
  toewijzingenRijbewijs: Array<ToewijzingRijbewijs>;

  /**
 * @ignore
 */
  rijbewijs: Rijbewijs;

  /**
 * @ignore
 */
  isGearchiveerd: boolean;

  /**
 * @ignore
 */
  geboorteDatum: Date;
}
