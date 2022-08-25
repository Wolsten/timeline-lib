<script>
	import { browser } from '$app/env';
	import Test from '$lib/Test.svelte';
	import '$lib/styles/app.css';

	const settings = {};

	let data;

	if (browser) {
		// fetch('/data/deaths-from-natural-disasters.json');
		fetch('/data/history-of-taiwan.json')
			.then((response) => {
				return response.json();
			})
			.then((jsonData) => {
				// console.log('jsonData', jsonData);
				data = jsonData;
			});
	}
</script>

<h1>Timeline Library Test Page</h1>

<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Test {data} {settings} />

<style>
	p {
		text-align: center;
	}
	h1 {
		text-align: center;
	}
</style>
