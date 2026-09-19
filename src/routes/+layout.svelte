<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<title>Вгадай країну</title>

	<meta
		name="description"
		content="Гра з географії, де відстань вимірюється сухопутними кордонами."
	/>

	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
