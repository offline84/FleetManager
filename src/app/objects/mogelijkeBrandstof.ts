import {IMogelijkeBrandstof} from "./IMogelijkeBrandstof";
import {Brandstof} from "./brandstof";

/**
 * Deze klasse wordt gebruikt om op correcte wijze de lijst van brandstoffen op te bouwen voor het verzenden naar de Backend.
 *
 * Erft over van IMogelijkeBrandstof.
 */
export class mogelijkeBrandstof implements IMogelijkeBrandstof {
  brandstof!: Brandstof;
  constructor() { }
}
