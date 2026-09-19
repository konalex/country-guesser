import { describe, expect, it } from 'vitest';
import { createGame } from './game.svelte';
import type { Country } from '$lib/types/country';

const countries: Country[] = [
	{ code: 'PRT', name: 'Portugal', borders: ['ESP'], flag: '🇵🇹', region: 'Europe' },
	{ code: 'ESP', name: 'Spain', borders: ['FRA'], flag: '🇪🇸', region: 'Europe' },
	{ code: 'FRA', name: 'France', borders: ['DEU'], flag: '🇫🇷', region: 'Europe' },
	{ code: 'DEU', name: 'Germany', borders: ['CZE'], flag: '🇩🇪', region: 'Europe' },
	{ code: 'CZE', name: 'Czechia', borders: [], flag: '🇨🇿', region: 'Europe' },
	{ code: 'ISL', name: 'Iceland', borders: [], flag: '🇮🇸', region: 'Europe' }
];

describe('createGame', () => {
	it('starts a Connected World game with a target from the largest component', () => {
		const game = createGame(
			countries,
			() => 0.99,
			() => 1_000
		);

		game.startNewGame();

		expect(game.state).toMatchObject({
			targetCountry: countries[4],
			guesses: [],
			status: 'playing',
			startedAt: 1_000
		});
		expect(game.playableCountries.map((country) => country.code)).not.toContain('ISL');
	});

	it('adds a guess with its BFS distance and a temperature relation', () => {
		const game = createGame(countries, () => 0.99);
		game.startNewGame();

		expect(game.guessCountry('PRT')).toMatchObject({ distance: 4 });
		expect(game.guessCountry('FRA')).toMatchObject({ distance: 2, relation: 'warmer' });
		expect(game.guessCountry('ESP')).toMatchObject({ distance: 3, relation: 'colder' });
		expect(game.guessCountry('DEU')).toMatchObject({ distance: 1, relation: 'warmer' });
		expect(game.attempts).toBe(4);
		expect(game.closestGuess?.country.code).toBe('DEU');
	});

	it('marks the game as won when the target is guessed', () => {
		const game = createGame(countries, () => 0.99);
		game.startNewGame();

		expect(game.guessCountry('CZE')).toMatchObject({ distance: 0 });
		expect(game.state.status).toBe('won');
	});

	it('does not accept guesses before a game, repeated guesses, or disconnected countries', () => {
		const game = createGame(countries, () => 0.99);

		expect(game.guessCountry('PRT')).toBeNull();

		game.startNewGame();
		expect(game.guessCountry('PRT')).not.toBeNull();
		expect(game.guessCountry('PRT')).toBeNull();
		expect(game.guessCountry('ISL')).toBeNull();
	});
});
