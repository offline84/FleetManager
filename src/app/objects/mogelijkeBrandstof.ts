import {IMogelijkeBrandstof} from "./IMogelijkeBrandstof";
import {Brandstof} from "./brandstof";

export class mogelijkeBrandstof implements IMogelijkeBrandstof {
  brandstof!: Brandstof;
  constructor() { }
}
