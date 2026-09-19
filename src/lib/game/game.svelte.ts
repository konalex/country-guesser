import { getBorderDistance } from '$lib/graph/bfs';
import { createCountryGraph, getConnectedComponents } from '$lib/graph/graph';
import type { Country } from '$lib/types/country';
import type { GameState, Guess, GuessRelation } from './types';

export interface Game {
	state: GameState;
	readonly playableCountries: Country[];
	readonly attempts: number;
	readonly closestGuess: Guess | null;
	startNewGame(): void;
	guessCountry(countryCode: string): Guess | null;
}

/**
 * Holds one Connected World game.
 *
 * The state is a Svelte 5 `$state` object, so components that read its fields
 * update automatically when a new game starts or a guess is added.
 */
export function createGame(
	countries: Country[],
	random: () => number = Math.random,
	now: () => number = Date.now
): Game {
	const graph = createCountryGraph(countries);
	const countriesByCode = Object.fromEntries(
		countries.map((country) => [country.code, country])
	) as Record<string, Country>;
	const connectedWorld = getLargestComponent(getConnectedComponents(graph));
	const playableCountries = countries.filter((country) => connectedWorld.has(country.code));
	const state = $state<GameState>({
		targetCountry: null,
		guesses: [],
		status: 'idle',
		startedAt: null
	});

	function startNewGame() {
		if (playableCountries.length === 0) {
			throw new Error('A game needs at least one country in a connected component.');
		}

		state.targetCountry = playableCountries[Math.floor(random() * playableCountries.length)];
		state.guesses = [];
		state.status = 'playing';
		state.startedAt = now();
	}

	function guessCountry(countryCode: string): Guess | null {
		if (state.status !== 'playing' || !state.targetCountry || !connectedWorld.has(countryCode)) {
			return null;
		}

		if (state.guesses.some((guess) => guess.country.code === countryCode)) {
			return null;
		}

		const country = countriesByCode[countryCode];
		const distance = getBorderDistance(graph, countryCode, state.targetCountry.code);

		if (!country || distance === null) {
			return null;
		}

		const previousGuess = state.guesses.at(-1);
		const relation = previousGuess ? getRelation(distance, previousGuess.distance) : undefined;
		const guess: Guess = { country, distance, ...(relation ? { relation } : {}) };

		state.guesses.push(guess);

		if (distance === 0) {
			state.status = 'won';
		}

		return guess;
	}

	return {
		state,
		playableCountries,
		get attempts() {
			return state.guesses.length;
		},
		get closestGuess() {
			return state.guesses.reduce<Guess | null>(
				(closest, guess) => (!closest || guess.distance < closest.distance ? guess : closest),
				null
			);
		},
		startNewGame,
		guessCountry
	};
}

function getLargestComponent(components: Set<string>[]): Set<string> {
	return components.reduce<Set<string>>(
		(largest, component) => (component.size > largest.size ? component : largest),
		new Set()
	);
}

function getRelation(currentDistance: number, previousDistance: number): GuessRelation {
	if (currentDistance < previousDistance) {
		return 'warmer';
	}

	if (currentDistance > previousDistance) {
		return 'colder';
	}

	return 'same';
}
