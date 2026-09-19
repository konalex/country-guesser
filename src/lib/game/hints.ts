import type { Country } from '$lib/types/country';
import type { Guess } from './types';

export interface CountryHint {
	label: string;
	value: string;
	comparison: string;
}

export interface CountryHints {
	current: CountryHint[];
	closest: CountryHint[];
}

/**
 * Compares the latest guess directly with the target and also keeps the
 * closest numeric values discovered across all guesses.
 *
 * Region is categorical, so it only belongs to the current guess.
 */
export function getCountryHints(target: Country, guesses: Guess[]): CountryHints {
	const latestGuess = guesses.at(-1);

	if (!latestGuess) {
		return { current: [], closest: [] };
	}

	const closestPopulation = getClosestGuess(
		guesses,
		target.population,
		(country) => country.population
	);
	const closestArea = getClosestGuess(guesses, target.area, (country) => country.area);
	const closestNeighbours = getClosestGuess(
		guesses,
		target.borders.length,
		(country) => country.borders.length
	);

	return {
		current: getCurrentHints(target, latestGuess),
		closest: [
			createPopulationHint(target, closestPopulation),
			createAreaHint(target, closestArea),
			createNeighboursHint(target, closestNeighbours)
		]
	};
}

function getCurrentHints(target: Country, guess: Guess): CountryHint[] {
	return [
		createPopulationHint(target, guess),
		createAreaHint(target, guess),
		createNeighboursHint(target, guess),
		{
			label: 'Регіон',
			value: guess.country.region,
			comparison: target.region === guess.country.region ? '✓' : '×'
		}
	];
}

function createPopulationHint(target: Country, guess: Guess): CountryHint {
	return {
		label: 'Населення',
		value: formatPopulation(guess.country.population),
		comparison: compareNumber(target.population, guess.country.population)
	};
}

function createAreaHint(target: Country, guess: Guess): CountryHint {
	return {
		label: 'Площа',
		value: `${formatNumber(guess.country.area)} км²`,
		comparison: compareNumber(target.area, guess.country.area)
	};
}

function createNeighboursHint(target: Country, guess: Guess): CountryHint {
	return {
		label: 'Сухопутні сусіди',
		value: guess.country.borders.length.toString(),
		comparison: compareNumber(target.borders.length, guess.country.borders.length)
	};
}

function getClosestGuess(
	guesses: Guess[],
	targetValue: number,
	getValue: (country: Country) => number
): Guess {
	return guesses.reduce((closestGuess, guess) =>
		Math.abs(getValue(guess.country) - targetValue) <
		Math.abs(getValue(closestGuess.country) - targetValue)
			? guess
			: closestGuess
	);
}

function compareNumber(targetValue: number, guessValue: number): string {
	if (targetValue === guessValue) {
		return '✓';
	}

	return targetValue > guessValue ? '↑' : '↓';
}

function formatPopulation(population: number): string {
	return new Intl.NumberFormat('uk-UA', {
		notation: 'compact',
		maximumFractionDigits: 1
	}).format(population);
}

function formatNumber(value: number): string {
	return new Intl.NumberFormat('uk-UA').format(value);
}
