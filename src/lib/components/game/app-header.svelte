<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	let {
		countryCount,
		disabled = false,
		onNewGame
	}: {
		countryCount: number;
		disabled?: boolean;
		onNewGame: () => void;
	} = $props();
</script>

<header class="flex flex-col gap-4 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
	<div class="flex items-center gap-3">
		<span
			class="grid size-9 place-items-center rounded-lg bg-primary text-lg text-primary-foreground"
			aria-hidden="true"
		>
			🌍
		</span>
		<span>
			<span class="block text-sm font-semibold tracking-tight">Вгадай країну</span>
			<span class="block text-xs text-muted-foreground">Знайдіть найкоротший шлях суходолом</span>
		</span>
	</div>

	<div class="flex flex-wrap items-center gap-2">
		<Badge variant="secondary" class="h-6 w-60 justify-center px-2.5 whitespace-nowrap"
			>{countryCount} країн у зв’язаному світі</Badge
		>
		<Button variant="outline" size="sm" onclick={onNewGame} {disabled}>Нова гра</Button>
	</div>
</header>
