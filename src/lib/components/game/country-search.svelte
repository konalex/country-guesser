<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import type { Country } from '$lib/types/country';

	let {
		countries,
		disabled = false,
		onSelect
	}: {
		countries: Country[];
		disabled?: boolean;
		onSelect: (countryCode: string) => void;
	} = $props();

	let query = $state('');

	const matchingCountries = $derived(
		query.trim()
			? countries
					.filter((country) =>
						country.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
					)
					.slice(0, 6)
			: []
	);

	function selectCountry(country: Country) {
		onSelect(country.code);
		query = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			query = '';
		}

		if (event.key === 'Enter' && matchingCountries[0]) {
			event.preventDefault();
			selectCountry(matchingCountries[0]);
		}
	}
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between gap-4">
		<label class="text-sm font-medium" for="country-search">Your guess</label>
		<span class="text-xs text-muted-foreground">Search by country name</span>
	</div>

	<Input
		id="country-search"
		bind:value={query}
		placeholder="Search for a country…"
		autocomplete="off"
		aria-describedby="country-search-help"
		{disabled}
		onkeydown={handleKeydown}
	/>

	{#if query.trim()}
		<div aria-live="polite">
			{#if matchingCountries.length > 0}
				<div class="flex flex-wrap gap-2" aria-label="Country suggestions">
					{#each matchingCountries as country (country.code)}
						<button
							type="button"
							class="rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
							onclick={() => selectCountry(country)}
						>
							<Badge variant="secondary" class="h-7 cursor-pointer px-3 text-sm">
								<span aria-hidden="true">{country.flag}</span>
								{country.name}
							</Badge>
						</button>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">No countries found.</p>
			{/if}
		</div>
	{/if}

	<p id="country-search-help" class="text-xs leading-relaxed text-muted-foreground">
		Select a country badge to make a guess. Press Enter to select the first match.
	</p>
</div>
