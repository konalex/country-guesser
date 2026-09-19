<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
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
			<span class="block text-sm font-semibold tracking-tight">Country Guesser</span>
			<span class="block text-xs text-muted-foreground">Find the shortest land-border route</span>
		</span>
	</div>

	<Badge variant="secondary" class="h-6 px-2.5">Connected World</Badge>
</header>
