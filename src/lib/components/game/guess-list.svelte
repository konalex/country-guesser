<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import type { Guess } from '$lib/game/types';
	import { cn } from '$lib/utils';

	let {
		guesses,
		class: className
	}: {
		guesses: Guess[];
		class?: string;
	} = $props();

	const latestGuesses = $derived([...guesses].reverse());

	const relationCopy = {
		warmer: '↑ Тепліше',
		colder: '↓ Холодніше',
		same: '→ Без змін'
	} as const;
</script>

<Card.Root class={cn('min-h-0', className)}>
	<Card.Header class="border-b">
		<Card.Title>Історія спроб</Card.Title>
		<Card.Description>Відстань у кордонах — основний показник.</Card.Description>
		<Card.Action>
			<Badge variant="outline">{guesses.length} спроб</Badge>
		</Card.Action>
	</Card.Header>

	<Card.Content class="min-h-0 flex-1 overflow-y-auto">
		{#if latestGuesses.length === 0}
			<div
				class="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center"
			>
				<span
					class="mb-3 grid size-10 place-items-center rounded-full bg-muted text-lg"
					aria-hidden="true">🧭</span
				>
				<p class="text-sm font-medium">Ваш маршрут почнеться з першої спроби.</p>
				<p class="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
					Кожен результат показує мінімальну кількість сухопутних кордонів між вашою та загаданою
					країною.
				</p>
			</div>
		{:else}
			<div>
				{#each latestGuesses as guess, index (guess.country.code)}
					<div class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
						<span class="text-xl" aria-hidden="true">{guess.country.flag}</span>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium">{guess.country.name}</p>
							<p class="text-xs text-muted-foreground">
								{guess.distance === 0 ? 'Відгадано' : `${guess.distance} кордонів до цілі`}
							</p>
						</div>
						{#if guess.distance === 0}
							<Badge>🎯 Відгадано</Badge>
						{:else if guess.relation}
							<Badge variant="secondary">{relationCopy[guess.relation]}</Badge>
						{/if}
					</div>
					{#if index < latestGuesses.length - 1}
						<Separator />
					{/if}
				{/each}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
