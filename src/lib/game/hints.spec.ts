import { describe, expect, it } from 'vitest';
import { getCountryHints } from './hints';
import type { Guess } from './types';
import type { Country } from '$lib/types/country';

const target: Country = {
	code: 'CZE',
	name: 'Czechia',
	borders: ['AUT', 'DEU', 'POL', 'SVK'],
	flag: '🇨🇿',
	region: 'Europe',
	area: 78_866,
	population: 10_900_000
};

const closeGuess: Guess = {
	country: {
		code: 'AAA',
		name: 'Closer country',
		borders: ['BBB', 'CCC', 'DDD'],
		flag: '🏳️',
		region: 'Europe',
		area: 75_000,
		population: 10_500_000
	},
	distance: 2
};

const fartherGuess: Guess = {
	country: {
		code: 'BBB',
		name: 'Farther country',
		borders: ['CCC'],
		flag: '🏳️',
		region: 'Asia',
		area: 200_000,
		population: 5_000_000
	},
	distance: 4
};

describe('getCountryHints', () => {
	it('compares the latest guess while keeping the closest numeric values', () => {
		expect(getCountryHints(target, [closeGuess, fartherGuess])).toEqual({
			current: [
				{ label: 'Населення', value: '5 млн', comparison: '↑' },
				{ label: 'Площа', value: '200 000 км²', comparison: '↓' },
				{ label: 'Сухопутні сусіди', value: '1', comparison: '↑' },
				{ label: 'Регіон', value: 'Asia', comparison: '×' }
			],
			closest: [
				{ label: 'Населення', value: '10,5 млн', comparison: '↑' },
				{ label: 'Площа', value: '75 000 км²', comparison: '↑' },
				{ label: 'Сухопутні сусіди', value: '3', comparison: '↑' }
			]
		});
	});

	it('replaces a value when a new guess is numerically closer to the target', () => {
		const closerGuess: Guess = {
			country: {
				...fartherGuess.country,
				code: 'CCC',
				name: 'Closest country',
				borders: ['AAA', 'BBB', 'DDD', 'EEE'],
				area: 79_000,
				population: 10_800_000,
				region: 'Europe'
			},
			distance: 1
		};

		expect(getCountryHints(target, [closeGuess, closerGuess])).toEqual({
			current: [
				{ label: 'Населення', value: '10,8 млн', comparison: '↑' },
				{ label: 'Площа', value: '79 000 км²', comparison: '↓' },
				{ label: 'Сухопутні сусіди', value: '4', comparison: '✓' },
				{ label: 'Регіон', value: 'Europe', comparison: '✓' }
			],
			closest: [
				{ label: 'Населення', value: '10,8 млн', comparison: '↑' },
				{ label: 'Площа', value: '79 000 км²', comparison: '↓' },
				{ label: 'Сухопутні сусіди', value: '4', comparison: '✓' }
			]
		});
	});

	it('returns empty groups before the first guess', () => {
		expect(getCountryHints(target, [])).toEqual({ current: [], closest: [] });
	});
});
