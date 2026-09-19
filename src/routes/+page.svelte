<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import AppHeader from '$lib/components/game/app-header.svelte';
	import CountrySearch from '$lib/components/game/country-search.svelte';
	import GameStats from '$lib/components/game/game-stats.svelte';
	import GuessList, { type GuessView } from '$lib/components/game/guess-list.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { createGame, type Game } from '$lib/game/game.svelte';

	let { data }: { data: PageData } = $props();
	let game = $state.raw<Game | null>(null);
	let currentTime = $state(Date.now());

	const guesses = $derived<GuessView[]>(
		(game?.state.guesses ?? []).map((guess) => ({
			code: guess.country.code,
			name: guess.country.name,
			flag: guess.country.flag,
			distance: guess.distance,
			...(guess.relation ? { relation: guess.relation } : {})
		}))
	);
	const recentGuesses = $derived([...guesses].reverse());
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
	<title>Country Guesser</title>
</svelte:head>

<div class="h-dvh overflow-hidden bg-muted/30">
	<div class="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
		<AppHeader />

		<main
			class="grid min-h-0 flex-1 grid-rows-[auto_minmax(0,1fr)] gap-6 py-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-1"
		>
			<div class="min-h-0">
				<section class="space-y-6" aria-label="Game controls">
					<div class="flex flex-wrap items-center gap-2">
						<Badge variant="secondary"
							>{game?.playableCountries.length ?? 0} countries in Connected World</Badge
						>
						<Button
							variant="outline"
							size="sm"
							onclick={() => game?.startNewGame()}
							disabled={!game}>New game</Button
						>
					</div>

					<Card.Root>
						<Card.Header>
							<Card.Title>Make a guess</Card.Title>
							<Card.Description
								>Select any country in the same connected land-border world.</Card.Description
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
				</section>
			</div>

			<aside class="flex min-h-0 flex-col gap-6" aria-label="Game information">
				<GameStats
					attempts={game?.attempts ?? 0}
					closestDistance={game?.closestGuess?.distance ?? null}
					{elapsedTime}
				/>

				<GuessList guesses={recentGuesses} class="flex-1" />
			</aside>
		</main>
	</div>
</div>
