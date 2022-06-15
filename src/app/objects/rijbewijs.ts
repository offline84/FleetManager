import { IRijbewijs } from "./iRijbewijs"

/**
 * Deze klasse wordt voornamelijk gebruikt om op correcte wijze een rijbewijs aan te maken of te wijzigen, klaar voor verzending naar de back-end.
 *
 * Erft over van IRijbewijs.
 */
export class Rijbewijs implements IRijbewijs {

  /**
 * @ignore
 */
  id!: string

  /**
* @ignore
*/
  typeRijbewijs!: string

  constructor() { }

}