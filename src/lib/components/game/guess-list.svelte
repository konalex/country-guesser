<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';

	export type GuessView = {
		code: string;
		name: string;
		flag: string;
		distance: number;
		relation?: 'warmer' | 'colder' | 'same';
	};

	let { guesses }: { guesses: GuessView[] } = $props();

	const relationCopy = {
		warmer: '↑ Warmer',
		colder: '↓ Colder',
		same: '→ Same'
	} as const;
</script>

<Card.Root>
	<Card.Header class="border-b">
		<Card.Title>Guess history</Card.Title>
		<Card.Description>Border distance is always the source of truth.</Card.Description>
		<Card.Action>
			<Badge variant="outline">{guesses.length} guesses</Badge>
		</Card.Action>
	</Card.Header>

	<Card.Content>
		{#if guesses.length === 0}
			<div
				class="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
			>
				<span
					class="mb-3 grid size-10 place-items-center rounded-full bg-muted text-lg"
					aria-hidden="true">🧭</span
				>
				<p class="text-sm font-medium">Your route starts with the first guess.</p>
				<p class="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
					Each result shows the minimum number of land borders between your guess and the mystery
					country.
				</p>
			</div>
		{:else}
			<div>
				{#each guesses as guess, index (guess.code)}
					<div class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
						<span class="text-xl" aria-hidden="true">{guess.flag}</span>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium">{guess.name}</p>
							<p class="text-xs text-muted-foreground">{guess.distance} borders away</p>
						</div>
						{#if index > 0 && guess.relation}
							<Badge variant="secondary">{relationCopy[guess.relation]}</Badge>
						{/if}
					</div>
					{#if index < guesses.length - 1}
						<Separator />
					{/if}
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
