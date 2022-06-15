import {mogelijkeBrandstof} from "./mogelijkeBrandstof";

/**
 * Deze interface wordt voornamelijk gebruikt op de data op te halen uit de database en als het ware te "patchen" met een object van het type Tankkaart.
 */
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
