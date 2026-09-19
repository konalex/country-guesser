import { describe, expect, it, vi } from 'vitest';
import { fetchCountries, normalizeCountry } from './countries';

describe('normalizeCountry', () => {
	it('maps the REST Countries response to the internal country model', () => {
		expect(
			normalizeCountry({
				codes: { alpha_2: 'CZ', alpha_3: 'CZE' },
				names: { common: 'Czechia' },
				flag: { emoji: '🇨🇿' },
				region: 'Europe',
				borders: ['AUT', 'DEU', 'POL', 'SVK'],
				area: { kilometers: 78_866 },
				population: 10_900_000
			})
		).toEqual({
			code: 'CZE',
			name: 'Чехія',
			searchNames: ['Czechia'],
			flag: '🇨🇿',
			region: 'Європа',
			borders: ['AUT', 'DEU', 'POL', 'SVK'],
			area: 78_866,
			population: 10_900_000
		});
	});

	it('uses an empty border list for island countries', () => {
		expect(
			normalizeCountry({
				codes: { alpha_3: 'ISL' },
				names: { common: 'Iceland' },
				flag: { emoji: '🇮🇸' },
				region: 'Europe',
				area: { kilometers: 103_000 },
				population: 390_000
			}).borders
		).toEqual([]);
	});

	it('uses the Ukrainian name for display and keeps the English name for search', () => {
		const country = normalizeCountry({
			codes: { alpha_2: 'UA', alpha_3: 'UKR' },
			names: { common: 'Ukraine' },
			flag: { emoji: '🇺🇦' },
			area: { kilometers: 603_628 },
			population: 37_000_000
		});

		expect(country.name).toBe('Україна');
		expect(country.searchNames).toEqual(['Ukraine']);
		expect(
			[country.name, ...(country.searchNames ?? [])].some((name) =>
				name.toLocaleLowerCase().includes('кра')
			)
		).toBe(true);
	});

	it('rejects an incomplete country response', () => {
		expect(() => normalizeCountry({ names: { common: 'Czechia' } })).toThrow(
			'REST Countries returned a country without a code, name, or flag.'
		);
	});

	it('loads every API page and sorts the normalized countries by name', async () => {
		const fetcher = vi
			.fn()
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						data: {
							objects: [
								{
									codes: { alpha_3: 'CZE' },
									names: { common: 'Czechia' },
									flag: { emoji: '🇨🇿' },
									area: { kilometers: 78_866 },
									population: 10_900_000
								},
								{
									names: { common: 'Not a playable country' }
								}
							],
							meta: { more: true }
						}
					})
				)
			)
			.mockResolvedValueOnce(
				new Response(
					JSON.stringify({
						data: {
							objects: [
								{
									codes: { alpha_3: 'ALB' },
									names: { common: 'Albania' },
									flag: { emoji: '🇦🇱' },
									area: { kilometers: 28_748 },
									population: 2_800_000
								}
							],
							meta: { more: false }
						}
					})
				)
			);

		const countries = await fetchCountries('test-key', fetcher as typeof fetch);

		expect(fetcher).toHaveBeenCalledTimes(2);
		expect(countries.map((country) => country.name)).toEqual(['Albania', 'Czechia']);
	});
});
