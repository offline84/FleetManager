import { IAdres } from "./iAdres"

/**
 * Deze klasse wordt voornamelijk gebruikt om op correcte wijze een adres aan te maken of te wijzigen, klaar voor verzending naar de back-end.
 *
 * Erft over van IAdres.
 */
export class Adres implements IAdres {

  /**
   * @ignore
   */
  straat!: string;

  /**
   * @ignore
   */
  huisnummer!: number;

  /**
   * @ignore
   */
  stad!: string;

  /**
   * @ignore
   */
  postcode!: number;
}
