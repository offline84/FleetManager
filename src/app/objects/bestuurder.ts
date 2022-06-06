import { IBestuurder } from "./iBestuurder"
import { Adres } from "./adres"
import { ToewijzingRijbewijs } from "./toewijzingRijbewijs"
import { Rijbewijs } from "./rijbewijs";
export class Bestuurder implements IBestuurder {

  rijksregisternummer!: string;
  naam!: string;
  achternaam!: string;
  adres: Adres = new Adres();
  koppeling!: any;
  isGearchiveerd!: boolean;
  geboorteDatum!: Date;
  laatstGeupdate!: Date;
  toewijzingenRijbewijs: Array<ToewijzingRijbewijs> = [];
  rijbewijzen: Array<Rijbewijs> = [];
  rijbewijs!: Rijbewijs;

  constructor() {

  }
}
