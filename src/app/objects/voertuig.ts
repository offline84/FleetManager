import {IVoertuig} from "./iVoertuig"

/**
 * Deze klasse wordt voornamelijk gebruikt om op correcte wijze een voertuig aan te maken of te wijzigen, klaar voor verzending naar de back-end.
 *
 * Erft over van iVoertuig.
 */
export class Voertuig implements IVoertuig {

  /**
   * @ignore
   */
  chassisnummer!: string;

  /**
   * @ignore
   */
  merk!: string;

  /**
   * @ignore
   */
  model!: string;

  /**
   * @ignore
   */
  nummerplaat!: string;

  /**
   * @ignore
   */
  bouwjaar!: number;

  /**
   * @ignore
   */
  brandstof!: { id: string; typeBrandstof: string; };

  /**
   * @ignore
   */
  categorie!: { id: string; typeWagen: string; };

  /**
   * @ignore
   */
  kleur!: string;

  /**
   * @ignore
   */
  aantalDeuren!: number;

  /**
   * @ignore
   */
  koppeling!: any;

  /**
   * @ignore
   */
  status!: { id: string; staat: string; };

  /**
   * @ignore
   */
  isGearchiveerd!: boolean;

  /**
   * @ignore
   */
  laatstGeupdate!: Date;
}
