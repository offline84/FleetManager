import { Adres } from "./adres";

export interface IBestuurder {
  rijksregisternummer: string;
  naam: string;
  achternaam: string;
  adres: Adres;
  koppeling: any;
  toewijzingenRijbewijs: any[];
  rijbewijzen: any[];
  rijbewijs: string;
  isGearchiveerd: boolean;
  geboorteDatum: Date;
}
