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
	const normalizedQuery = $derived(query.trim().toLocaleLowerCase());

	const matchingCountries = $derived(
		normalizedQuery
			? countries
					.filter((country) =>
						[country.name, ...(country.searchNames ?? [])].some((name) =>
							name.toLocaleLowerCase().includes(normalizedQuery)
						)
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
		<label class="text-sm font-medium" for="country-search">Ваша спроба</label>
		<span class="text-xs text-muted-foreground">Пошук за назвою країни</span>
	</div>

	<Input
		id="country-search"
		bind:value={query}
		placeholder="Пошук країни…"
		autocomplete="off"
		aria-describedby="country-search-help"
		{disabled}
		onkeydown={handleKeydown}
	/>

	<div class="min-h-7" aria-live="polite">
		{#if normalizedQuery}
			{#if matchingCountries.length > 0}
				<div
					class="flex h-7 flex-nowrap gap-2 overflow-x-auto overflow-y-hidden"
					aria-label="Підказки країн"
				>
					{#each matchingCountries as country (country.code)}
						<button
							type="button"
							class="shrink-0 rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
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
				<p class="text-sm text-muted-foreground">Країн не знайдено.</p>
			{/if}
		{/if}
	</div>

	<p id="country-search-help" class="text-xs leading-relaxed text-muted-foreground">
		Оберіть країну зі списку, щоб зробити спробу. Натисніть Enter, щоб обрати перший збіг.
	</p>
</div>
