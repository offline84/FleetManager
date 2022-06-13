import { Adres } from "./adres";
import { Rijbewijs } from "./rijbewijs";
import { ToewijzingRijbewijs } from "./toewijzingRijbewijs";

export interface IBestuurder {
  rijksregisternummer: string;
  naam: string;
  achternaam: string;
  adres: Adres;
  koppeling: any;
  toewijzingenRijbewijs: Array<ToewijzingRijbewijs>;
  rijbewijs: Rijbewijs;
  isGearchiveerd: boolean;
  geboorteDatum: Date;
}
