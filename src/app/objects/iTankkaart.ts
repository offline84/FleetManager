export interface ITankkaart {
  kaartnummer : string;
  geldigheidsDatum: Date;
  pincode: number;
  mogelijkeBrandstoffen: any;
  brandstoffenForView: string;
  isGeblokkeerd: boolean;
  isGearchiveerd: boolean;
  koppeling: any;
  laatstGeupdate: Date;
}
