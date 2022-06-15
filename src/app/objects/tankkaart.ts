import { ITankkaart } from "./iTankkaart";
import {mogelijkeBrandstof} from "./mogelijkeBrandstof";

/**
 * Deze klasse wordt voornamelijk gebruikt om op correcte wijze een tankkaart aan te maken of te wijzigen, klaar voor verzending naar de back-end.
 *
 * Erft over van iTankkaart.
 */
export class Tankkaart implements ITankkaart {
  kaartnummer!: string;
  geldigheidsDatum!: Date;
  pincode!: number;
  mogelijkeBrandstoffen: Array<mogelijkeBrandstof> = [];
  brandstoffenForView!: string;
  isGeblokkeerd!: boolean;
  isGearchiveerd!: boolean;
  koppeling!: any;
  laatstGeupdate!: Date;

  constructor() { }
}
