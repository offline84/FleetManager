import {IAdres} from "./iAdres"
export class Adres implements IAdres {

  straat!: string;
  huisnummer!: number;
  stad!: string;
  postcode!: number;

  constructor()
  {  }
}
