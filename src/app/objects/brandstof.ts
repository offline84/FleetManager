import {IBrandstof} from "./IBrandstof";
export class Brandstof implements IBrandstof {
  brandstof!: {
    id: string;
    typeBrandstof: string;
  }

  constructor() { }
}
