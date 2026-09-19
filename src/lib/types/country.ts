/**
 * The application's normalized representation of a country.
 *
 * `code` and each value in `borders` use the three-letter CCA3 country code.
 * Keeping this model independent from REST Countries makes graph and game code
 * straightforward to test.
 */
export interface Country {
	code: string;
	name: string;
	borders: string[];
	flag: string;
	region: string;
}
