export interface ITankkaart {
  kaartnummer : string;
  geldigheidsDatum: Date;
  pincode: number;
  mogelijkeBrandstoffen: any;
    // {
    //   brandstof: {
    //     id: string;
    //     typeBrandstof: string;
    //   }
    // };
  brandstoffenForView: string;
  isGeblokkeerd: boolean;
  isGearchiveerd: boolean;
  koppeling: any;
  laatstGeupdate: Date;
}
