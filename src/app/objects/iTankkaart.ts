import {mogelijkeBrandstof} from "./mogelijkeBrandstof";

export interface ITankkaart {
  kaartnummer : string;
  geldigheidsDatum: Date;
  pincode: number;
  mogelijkeBrandstoffen: Array<mogelijkeBrandstof>;
  brandstoffenForView: string;
  isGeblokkeerd: boolean;
  isGearchiveerd: boolean;
  koppeling: any;
  laatstGeupdate: Date;
}
