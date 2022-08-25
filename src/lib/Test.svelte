<script>
	import { onMount } from 'svelte';
	import Timeline from '$lib/Timeline/Timeline.svelte';
	import { windowWidth, mobile, desktop } from '$lib/stores.js';
	import Utils from '$lib/Utils';

	export let settings = {};
	export let data;

	let dataset;
	let error;

	onMount(() => {
		handleResize();
	});

	function handleResize() {
		$windowWidth = window.innerWidth;
		$desktop = $windowWidth >= Utils.NAV_BREAK;
		$mobile = !$desktop;
	}

	$: if (data) dataset = Utils.processDataset(data);
</script>

<svelte:window on:resize={handleResize} />

<div class="container">
	<main>
		{#if dataset}
			<header>
				<h2>{dataset.name}</h2>
			</header>
			<Timeline {dataset} {settings} />
		{/if}

		{#if error}
			<h1>Error encountered</h1>
			<p>Dataset not found</p>
		{/if}
	</main>
</div>

<style>
	p {
		text-align: center;
	}
	h1,
	h2 {
		text-align: center;
	}
</style>
