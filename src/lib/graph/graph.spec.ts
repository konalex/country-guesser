import { describe, expect, it } from 'vitest';
import { getBorderDistance, findShortestBorderPath } from './bfs';
import { createCountryGraph, getConnectedComponents } from './graph';
import type { Country } from '$lib/types/country';

const countries = [
	{ code: 'PRT', name: 'Portugal', borders: ['ESP'], flag: '🇵🇹', region: 'Europe' },
	{ code: 'ESP', name: 'Spain', borders: ['FRA'], flag: '🇪🇸', region: 'Europe' },
	{ code: 'FRA', name: 'France', borders: ['DEU'], flag: '🇫🇷', region: 'Europe' },
	{ code: 'DEU', name: 'Germany', borders: ['CZE'], flag: '🇩🇪', region: 'Europe' },
	{ code: 'CZE', name: 'Czechia', borders: ['POL'], flag: '🇨🇿', region: 'Europe' },
	{ code: 'POL', name: 'Poland', borders: ['UKR'], flag: '🇵🇱', region: 'Europe' },
	{ code: 'UKR', name: 'Ukraine', borders: [], flag: '🇺🇦', region: 'Europe' },
	{ code: 'ISL', name: 'Iceland', borders: [], flag: '🇮🇸', region: 'Europe' }
].map((country) => ({ ...country, area: 1, population: 1 })) satisfies Country[];

const graph = createCountryGraph(countries);

describe('createCountryGraph', () => {
	it('makes every listed land border traversable in both directions', () => {
		expect(graph.get('ESP')).toEqual(new Set(['PRT', 'FRA']));
		expect(graph.get('FRA')).toEqual(new Set(['ESP', 'DEU']));
	});

	it('keeps islands as separate connected components', () => {
		const components = getConnectedComponents(graph);

		expect(components).toHaveLength(2);
		expect(components).toContainEqual(new Set(['ISL']));
		expect(components).toContainEqual(new Set(['PRT', 'ESP', 'FRA', 'DEU', 'CZE', 'POL', 'UKR']));
	});
});

describe('breadth-first search', () => {
	it('returns one border for direct neighbours', () => {
		expect(getBorderDistance(graph, 'CZE', 'POL')).toBe(1);
	});

	it('finds the shortest distance across multiple borders', () => {
		expect(getBorderDistance(graph, 'CZE', 'UKR')).toBe(2);
	});

	it('returns zero and a one-country path for the same country', () => {
		expect(getBorderDistance(graph, 'CZE', 'CZE')).toBe(0);
		expect(findShortestBorderPath(graph, 'CZE', 'CZE')).toEqual(['CZE']);
	});

	it('returns null when countries are disconnected', () => {
		expect(getBorderDistance(graph, 'CZE', 'ISL')).toBeNull();
		expect(findShortestBorderPath(graph, 'CZE', 'ISL')).toBeNull();
	});

	it('reconstructs the shortest border route', () => {
		expect(findShortestBorderPath(graph, 'PRT', 'CZE')).toEqual([
			'PRT',
			'ESP',
			'FRA',
			'DEU',
			'CZE'
		]);
	});
});
