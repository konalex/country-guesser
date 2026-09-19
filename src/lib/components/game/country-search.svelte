<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
</script>

<div class="space-y-3">
	<div class="flex items-center justify-between gap-4">
		<label class="text-sm font-medium" for="country-search">Your guess</label>
		<span class="text-xs text-muted-foreground">Search by country name</span>
	</div>

	<div class="flex gap-2">
		<Input
			id="country-search"
			placeholder="Loading countries…"
			aria-describedby="country-search-help"
			disabled
		/>
		<Button disabled>Guess</Button>
	</div>

	<p id="country-search-help" class="text-xs leading-relaxed text-muted-foreground">
		Countries will be available once the game data is loaded. Already guessed countries will not be
		shown again.
	</p>
</div>
