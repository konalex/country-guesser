import type { Country } from '$lib/types/country';

const REST_COUNTRIES_URL = 'https://api.restcountries.com/countries/v5';
const PAGE_SIZE = 100;
const ukrainianCountryNames = new Intl.DisplayNames('uk-UA', { type: 'region' });
const COUNTRY_FIELDS = [
	'names.common',
	'codes.alpha_2',
	'codes.alpha_3',
	'flag.emoji',
	'region',
	'borders',
	'area.kilometers',
	'population'
];

type RestCountriesCountry = {
	names?: {
		common?: string;
	};
	codes?: {
		alpha_2?: string;
		alpha_3?: string;
	};
	flag?: {
		emoji?: string;
	};
	region?: string;
	borders?: string[];
	area?: {
		kilometers?: number;
	};
	population?: number;
};

type RestCountriesPage = {
	data: {
		objects: RestCountriesCountry[];
		meta: {
			more: boolean;
		};
	};
};

type RestCountriesError = {
	errors?: Array<{
		message?: string;
	}>;
};

type CompleteRestCountriesCountry = RestCountriesCountry & {
	names: { common: string };
	codes: { alpha_3: string };
	flag: { emoji: string };
	area: { kilometers: number };
	population: number;
};

/** Converts the API's response shape into the application's country model. */
export function normalizeCountry(rawCountry: RestCountriesCountry): Country {
	if (!hasCountryDetails(rawCountry)) {
		throw new Error('REST Countries returned a country without a code, name, or flag.');
	}

	const localizedName = getUkrainianCountryName(rawCountry.codes.alpha_2);

	return {
		code: rawCountry.codes.alpha_3,
		name: localizedName ?? rawCountry.names.common,
		searchNames: getSearchNames(rawCountry.names.common, localizedName),
		borders: rawCountry.borders ?? [],
		flag: rawCountry.flag.emoji,
		region: translateRegion(rawCountry.region),
		area: rawCountry.area.kilometers,
		population: rawCountry.population
	};
}

function getUkrainianCountryName(alpha2Code?: string): string | undefined {
	return alpha2Code ? ukrainianCountryNames.of(alpha2Code) : undefined;
}

function getSearchNames(commonName: string, localizedName?: string): string[] {
	return localizedName && localizedName !== commonName ? [commonName] : [];
}

function translateRegion(region?: string): string {
	const translations: Record<string, string> = {
		Africa: 'Африка',
		Americas: 'Америка',
		Antarctic: 'Антарктика',
		Antarctica: 'Антарктика',
		Asia: 'Азія',
		Europe: 'Європа',
		Oceania: 'Океанія'
	};

	return region ? (translations[region] ?? region) : 'Невідомо';
}

/**
 * Loads every country needed to create the land-border graph.
 *
 * The API key is deliberately passed in by server-side code instead of being
 * imported here, so it is never included in a client-side bundle.
 */
export async function fetchCountries(
	apiKey: string,
	fetcher: typeof fetch = fetch
): Promise<Country[]> {
	if (!apiKey) {
		throw new Error('REST_COUNTRIES_API_KEY is not configured.');
	}

	const countries: Country[] = [];
	let offset = 0;
	let hasMore = true;

	while (hasMore) {
		const url = new URL(REST_COUNTRIES_URL);
		url.searchParams.set('response_fields', COUNTRY_FIELDS.join(','));
		url.searchParams.set('limit', PAGE_SIZE.toString());
		url.searchParams.set('offset', offset.toString());

		const response = await fetcher(url, {
			headers: {
				Authorization: `Bearer ${apiKey}`
			}
		});

		if (!response.ok) {
			const errorResponse = (await response.json().catch(() => null)) as RestCountriesError | null;
			const message = errorResponse?.errors?.[0]?.message;

			throw new Error(
				`REST Countries request failed with status ${response.status}${message ? `: ${message}` : '.'}`
			);
		}

		const page = (await response.json()) as RestCountriesPage;
		countries.push(...page.data.objects.filter(hasCountryDetails).map(normalizeCountry));
		hasMore = page.data.meta.more;
		offset += PAGE_SIZE;
	}

	return countries.sort((first, second) => first.name.localeCompare(second.name));
}

function hasCountryDetails(country: RestCountriesCountry): country is CompleteRestCountriesCountry {
	return Boolean(
		country.codes?.alpha_3 &&
		country.names?.common &&
		country.flag?.emoji &&
		typeof country.area?.kilometers === 'number' &&
		typeof country.population === 'number'
	);
}
