import { describe, expect, it, vi } from 'vitest';
import { fetchCountries, normalizeCountry } from './countries';

describe('normalizeCountry', () => {
	it('maps the REST Countries response to the internal country model', () => {
		expect(
			normalizeCountry({
				codes: { alpha_3: 'CZE' },
				names: { common: 'Czechia' },
				flag: { emoji: '🇨🇿' },
				region: 'Europe',
				borders: ['AUT', 'DEU', 'POL', 'SVK']
			})
		).toEqual({
			code: 'CZE',
			name: 'Czechia',
			flag: '🇨🇿',
			region: 'Europe',
			borders: ['AUT', 'DEU', 'POL', 'SVK']
		});
	});

	it('uses an empty border list for island countries', () => {
		expect(
			normalizeCountry({
				codes: { alpha_3: 'ISL' },
				names: { common: 'Iceland' },
				flag: { emoji: '🇮🇸' },
				region: 'Europe'
			}).borders
		).toEqual([]);
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
									flag: { emoji: '🇨🇿' }
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
									flag: { emoji: '🇦🇱' }
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
