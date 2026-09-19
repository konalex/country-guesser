<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Country Guesser</title>

	<meta name="description" content="A geography game where distance is measured by land borders." />

	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
