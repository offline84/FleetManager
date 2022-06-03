import { Adres } from "./adres";

export interface IBestuurder {
  rijksregisternummer: string;
  naam: string;
  achternaam: string;
  adres: Adres;
  koppeling: string;
  toewijzingenRijbewijs:[{
    rijbewijsId: string;
  }];
  isGearchiveerd: boolean;
  geboorteDatum: Date;
}
