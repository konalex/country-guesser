<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { getCountryHints } from '$lib/game/hints';
	import type { Guess } from '$lib/game/types';
	import type { Country } from '$lib/types/country';

	let {
		targetCountry,
		guesses
	}: {
		targetCountry: Country | null;
		guesses: Guess[];
	} = $props();

	const hints = $derived(
		targetCountry ? getCountryHints(targetCountry, guesses) : { current: [], closest: [] }
	);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Підказки для порівняння</Card.Title>
		<Card.Description>Порівняйте останню спробу й відстежуйте найближчі значення.</Card.Description>
	</Card.Header>
	<Card.Content>
		{#if hints.current.length > 0}
			<div class="grid gap-6 md:grid-cols-2">
				<section aria-labelledby="current-guess-heading">
					<h3 id="current-guess-heading" class="mb-2 text-sm font-medium">Поточна спроба</h3>
					<dl class="divide-y">
						{#each hints.current as hint (hint.label)}
							<div class="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
								<dt class="text-sm text-muted-foreground">{hint.label}</dt>
								<dd class="text-right text-sm">
									<span class="font-semibold tabular-nums">{hint.value}</span>
									<span class="ml-2 text-muted-foreground">{hint.comparison}</span>
								</dd>
							</div>
						{/each}
					</dl>
				</section>

				<section
					class="border-t pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6"
					aria-labelledby="closest-values-heading"
				>
					<h3 id="closest-values-heading" class="mb-2 text-sm font-medium">Найближчі значення</h3>
					<dl class="divide-y">
						{#each hints.closest as hint (hint.label)}
							<div class="flex items-center justify-between gap-6 py-3 first:pt-0 last:pb-0">
								<dt class="text-sm text-muted-foreground">{hint.label}</dt>
								<dd class="text-right text-sm">
									<span class="font-semibold tabular-nums">{hint.value}</span>
									<span class="ml-2 text-muted-foreground">{hint.comparison}</span>
								</dd>
							</div>
						{/each}
					</dl>
				</section>
			</div>
		{:else}
			<p class="text-sm leading-relaxed text-muted-foreground">
				Зробіть спробу, щоб побачити порівняння із цільовою країною.
			</p>
		{/if}
	</Card.Content>
</Card.Root>
