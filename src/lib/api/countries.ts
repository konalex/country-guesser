import type { Country } from '$lib/types/country';

const REST_COUNTRIES_URL = 'https://api.restcountries.com/countries/v5';
const PAGE_SIZE = 100;
const COUNTRY_FIELDS = ['names.common', 'codes.alpha_3', 'flag.emoji', 'region', 'borders'];

type RestCountriesCountry = {
	names?: {
		common?: string;
	};
	codes?: {
		alpha_3?: string;
	};
	flag?: {
		emoji?: string;
	};
	region?: string;
	borders?: string[];
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

/** Converts the API's response shape into the application's country model. */
export function normalizeCountry(rawCountry: RestCountriesCountry): Country {
	const code = rawCountry.codes?.alpha_3;
	const name = rawCountry.names?.common;
	const flag = rawCountry.flag?.emoji;

	if (!code || !name || !flag) {
		throw new Error('REST Countries returned a country without a code, name, or flag.');
	}

	return {
		code,
		name,
		borders: rawCountry.borders ?? [],
		flag,
		region: rawCountry.region ?? 'Unknown'
	};
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
		countries.push(
			...page.data.objects
				.filter(
					(country) =>
						Boolean(country.codes?.alpha_3) &&
						Boolean(country.names?.common) &&
						Boolean(country.flag?.emoji)
				)
				.map(normalizeCountry)
		);
		hasMore = page.data.meta.more;
		offset += PAGE_SIZE;
	}

	return countries.sort((first, second) => first.name.localeCompare(second.name));
}
