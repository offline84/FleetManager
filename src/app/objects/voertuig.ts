import {IVoertuig} from "./iVoertuig"
export class Voertuig implements IVoertuig {

  chassisnummer: string;
  merk: string;
  model: string;
  nummerplaat!: string;
  bouwjaar!: number;
  brandstof: { id: string; typeBrandstof: string; };
  categorie: { id: string; typeWagen: string; };
  kleur!: string;
  aantalDeuren!: number;
  koppeling!: any;
  status: { id: string; staat: string; };
  isGearchiveerd!: boolean;
  laatstGeupdate!: Date;

  constructor(chassisnummer: string, merk: string, model: string,
    brandstof: { id: string, typeBrandstof: string;},
    categorie: { id: string, typeWagen: string;},
    status: { id: string; staat: string;})
  {
    this.chassisnummer = chassisnummer;
    this.merk = merk;
    this.model = model;
    this.brandstof = brandstof;
    this.categorie = categorie;
    this.status = status;
  }
}
