import {IBrandstof} from "./IBrandstof";

/**
 * Deze klasse wordt gebruikt om op correcte wijze de brandstof in de lijst 'mogelijkeBrandstoffen' op te bouwen voor het verzenden naar de Backend.
 *
 * Erft over van IBrandstof.
 */
export class Brandstof implements IBrandstof {
    id!: string;
    typeBrandstof!: string;
  constructor() { }
}
