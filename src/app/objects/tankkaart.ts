import  {ITankkaart} from "./iTankkaart";
export class Tankkaart implements ITankkaart {
  kaartnummer!: string;
  geldigheidsdatum!: Date;
  pincode!: number;
  mogelijkebrandstoffen!:
    {
      brandstof: {
        id: string;
        typeBrandstof: string;
      }
    };
  isGeblokkeerd!: boolean;
  isGearchiveerd!: boolean;
  koppeling!: any;
  laatstGeupdate!: Date;

  constructor() { }
}
