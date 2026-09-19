<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import AppHeader from '$lib/components/game/app-header.svelte';
	import CountrySearch from '$lib/components/game/country-search.svelte';
	import GuessHints from '$lib/components/game/guess-hints.svelte';
	import GameStats from '$lib/components/game/game-stats.svelte';
	import GuessList from '$lib/components/game/guess-list.svelte';
	import * as Card from '$lib/components/ui/card';
	import { createGame, type Game } from '$lib/game/game.svelte';

	let { data }: { data: PageData } = $props();
	let game = $state.raw<Game | null>(null);
	let currentTime = $state(Date.now());

	const availableCountries = $derived(
		(game?.playableCountries ?? []).filter(
			(country) => !game?.state.guesses.some((guess) => guess.country.code === country.code)
		)
	);
	const elapsedTime = $derived(
		formatElapsedTime(Math.max(0, currentTime - (game?.state.startedAt ?? currentTime)))
	);

	onMount(() => {
		currentTime = Date.now();
		game = createGame(data.countries);
		game.startNewGame();
		const interval = window.setInterval(() => (currentTime = Date.now()), 1_000);

		return () => window.clearInterval(interval);
	});

	function formatElapsedTime(milliseconds: number): string {
		const totalSeconds = Math.floor(milliseconds / 1_000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;

		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}
</script>

<svelte:head>
	<title>Вгадай країну</title>
</svelte:head>

<div class="h-dvh overflow-hidden bg-muted/30">
	<div class="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
		<AppHeader
			countryCount={game?.playableCountries.length ?? 0}
			disabled={!game}
			onNewGame={() => game?.startNewGame()}
		/>

		<main
			class="grid min-h-0 flex-1 gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_minmax(0,1fr)]"
		>
			<Card.Root>
				<Card.Header>
					<Card.Title>Зробіть спробу</Card.Title>
					<Card.Description
						>Оберіть будь-яку країну з того самого зв’язаного світу сухопутних кордонів.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<CountrySearch
						countries={availableCountries}
						disabled={!game || game.state.status !== 'playing'}
						onSelect={(countryCode) => game?.guessCountry(countryCode)}
					/>
				</Card.Content>
			</Card.Root>

			<GameStats
				attempts={game?.attempts ?? 0}
				closestDistance={game?.closestGuess?.distance ?? null}
				{elapsedTime}
			/>

			<GuessHints
				targetCountry={game?.state.targetCountry ?? null}
				guesses={game?.state.guesses ?? []}
			/>

			<GuessList guesses={game?.state.guesses ?? []} class="h-full min-h-0" />
		</main>
	</div>
</div>
