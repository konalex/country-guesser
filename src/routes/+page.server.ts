import { fetchCountries } from '$lib/api/countries';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		countries: await fetchCountries(env.REST_COUNTRIES_API_KEY ?? '')
	};
};
