import { ITankkaart } from "./iTankkaart";
import {mogelijkeBrandstof} from "./mogelijkeBrandstof";

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
