/**
 * Deze interface wordt voornamelijk gebruikt op de data op te halen uit de database en als het ware te "patchen" met een object van het type Voertuig.
 */
export interface IVoertuig {

  /**
 * @ignore
 */
  chassisnummer: string;

  /**
 * @ignore
 */
  merk: string;

  /**
 * @ignore
 */
  model: string;

  /**
 * @ignore
 */
  nummerplaat: string;

  /**
 * @ignore
 */
  bouwjaar: number;

  /**
 * @ignore
 */
  brandstof: {
    id: string;
    typeBrandstof: string;
  };

  /**
 * @ignore
 */
  categorie: {
    id: string;
    typeWagen: string;
  };

  /**
 * @ignore
 */
  kleur: string;

  /**
 * @ignore
 */
  aantalDeuren: number;

  /**
 * @ignore
 */
  koppeling: string;

  /**
 * @ignore
 */
  status: {
    id: string;
    staat: string;
  };

  /**
 * @ignore
 */
  isGearchiveerd: boolean;

  /**
 * @ignore
 */
  laatstGeupdate: Date;
}
