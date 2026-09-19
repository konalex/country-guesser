<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	let {
		attempts,
		closestDistance,
		elapsedTime
	}: {
		attempts: number;
		closestDistance: number | null;
		elapsedTime: string;
	} = $props();

	const stats = $derived([
		{ label: 'Attempts', value: attempts.toString() },
		{
			label: 'Closest guess',
			value: closestDistance === null ? '—' : `${closestDistance} borders`
		},
		{ label: 'Elapsed time', value: elapsedTime }
	]);
</script>

<Card.Root size="sm">
	<Card.Header>
		<Card.Title>Game stats</Card.Title>
		<Card.Description>Updated as you make guesses.</Card.Description>
	</Card.Header>
	<Card.Content>
		<dl class="divide-y">
			{#each stats as stat (stat.label)}
				<div class="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
					<dt class="text-sm text-muted-foreground">{stat.label}</dt>
					<dd class="text-sm font-semibold tabular-nums">{stat.value}</dd>
				</div>
			{/each}
		</dl>
	</Card.Content>
</Card.Root>
