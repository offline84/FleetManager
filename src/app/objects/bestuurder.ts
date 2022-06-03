import {IBestuurder} from "./iBestuurder"
import {Adres} from "./adres"
export class Bestuurder implements IBestuurder {

  rijksregisternummer!: string;
  naam!: string;
  achternaam!: string;
  adres!: Adres;
  koppeling!: any;
  isGearchiveerd!: boolean;
  geboorteDatum!: Date;
  laatstGeupdate!: Date;
  toewijzingenRijbewijs!: any[];
  rijbewijzen!: any[];
  rijbewijs!: string;
  constructor()  {    }
}
