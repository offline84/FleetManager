import { IBestuurder } from "./iBestuurder"
import { Adres } from "./adres"
import { ToewijzingRijbewijs } from "./toewijzingRijbewijs"
import { Rijbewijs } from "./rijbewijs";

/**
 * Deze klasse wordt voornamelijk gebruikt om op correcte wijze een bestuurder aan te maken of te wijzigen, klaar voor verzending naar de back-end.
 *
 * Erft over van IBestuurder.
 * Bevat Adres, ToewijzingRijbewijs, Rijbewijs.
 */
export class Bestuurder implements IBestuurder {

  /**
   * @ignore
   */
  rijksregisternummer!: string;
  
  /**
   * @ignore
   */
  naam!: string;
  
  /**
   * @ignore
   */
  achternaam!: string;
  
  /**
   * @ignore
   */
  adres: Adres = new Adres();
  
  /**
   * @ignore
   */
  koppeling!: any;
  
  /**
   * @ignore
   */
  isGearchiveerd!: boolean;
  
  /**
   * @ignore
   */
  geboorteDatum!: Date;
  
  /**
   * @ignore
   */
  laatstGeupdate!: Date;
  
  /**
   * @ignore
   */
  toewijzingenRijbewijs: Array<ToewijzingRijbewijs> = [];
  
  /**
   * @ignore
   */
  rijbewijzen: Array<Rijbewijs> = [];
  
  /**
   * @ignore
   */
  rijbewijs!: Rijbewijs;

  constructor() {

  }
}
