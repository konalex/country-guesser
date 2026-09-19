<script lang="ts">
	import AppHeader from '$lib/components/game/app-header.svelte';
	import CountrySearch from '$lib/components/game/country-search.svelte';
	import GameStats from '$lib/components/game/game-stats.svelte';
	import GuessList, { type GuessView } from '$lib/components/game/guess-list.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';

	const guesses: GuessView[] = [];
</script>

<svelte:head>
	<title>Country Guesser</title>
</svelte:head>

<div class="min-h-screen bg-muted/30">
	<div class="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
		<AppHeader />

		<main class="grid gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
			<div class="space-y-6">
				<section class="space-y-3" aria-labelledby="game-title">
					<Badge variant="secondary">Game in progress</Badge>
					<div>
						<h1 id="game-title" class="text-3xl font-semibold tracking-tight sm:text-4xl">
							Find the mystery country.
						</h1>
						<p class="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
							Every guess reveals the fewest land borders you need to cross to reach the target.
						</p>
					</div>
				</section>

				<Card.Root>
					<Card.Header>
						<Card.Title>Make a guess</Card.Title>
						<Card.Description
							>Select any country in the same connected land-border world.</Card.Description
						>
					</Card.Header>
					<Card.Content>
						<CountrySearch />
					</Card.Content>
				</Card.Root>

				<GuessList {guesses} />
			</div>

			<aside class="space-y-6" aria-label="Game information">
				<GameStats attempts={0} closestDistance={null} elapsedTime="00:00" />

				<Card.Root size="sm">
					<Card.Header>
						<Card.Title>How it works</Card.Title>
					</Card.Header>
					<Card.Content>
						<ol class="space-y-3 text-sm leading-relaxed text-muted-foreground">
							<li class="flex gap-3">
								<span class="font-medium text-foreground">1.</span> Pick a country.
							</li>
							<li class="flex gap-3">
								<span class="font-medium text-foreground">2.</span> Read its border distance.
							</li>
							<li class="flex gap-3">
								<span class="font-medium text-foreground">3.</span> Follow warmer clues to the target.
							</li>
						</ol>
					</Card.Content>
				</Card.Root>
			</aside>
		</main>
	</div>
</div>
