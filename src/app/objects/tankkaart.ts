import { ITankkaart } from "./iTankkaart";
export class Tankkaart implements ITankkaart {
  kaartnummer!: string;
  geldigheidsDatum!: Date;
  pincode!: number;
  mogelijkeBrandstoffen!:
    {
      brandstof: {
        id: string;
        typeBrandstof: string;
      }
    };
  brandstoffenForView!: string;
  isGeblokkeerd!: boolean;
  isGearchiveerd!: boolean;
  koppeling!: any;
  laatstGeupdate!: Date;

  constructor() { }
}
