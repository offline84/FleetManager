export interface IVoertuig {
  chassisnummer: string;
  merk: string;
  model: string;
  nummerplaat: string;
  bouwjaar: number;
  brandstof: {
    id: string;
    typeBrandstof: string;
  };
  categorie:{
    id: string;
    typeWagen: string;
  };
  kleur: string;
  aantalDeuren: number;
  koppeling: any;
  status: {
    id: string;
    staat: string;
  }
  isGearchiveerd: boolean;
  laatstGeupdate: Date;
}
