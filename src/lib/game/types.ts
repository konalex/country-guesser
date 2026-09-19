import type { Country } from '$lib/types/country';

export type GameStatus = 'idle' | 'playing' | 'won';

export type GuessRelation = 'warmer' | 'colder' | 'same';

export interface Guess {
	country: Country;
	distance: number;
	relation?: GuessRelation;
}

export interface GameState {
	targetCountry: Country | null;
	guesses: Guess[];
	status: GameStatus;
	startedAt: number | null;
}
