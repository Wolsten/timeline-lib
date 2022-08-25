<script>
	import { onMount } from 'svelte';

	import Utils from '$lib/Utils.js';
	import Axes from '$lib/Timeline/Axes.svelte';
	import Events from '$lib/Timeline/Events.svelte';
	import Canvas from '$lib/Timeline/Canvas.svelte';
	import Legend from '$lib/Timeline/Legend.svelte';
	import Options from '$lib/Timeline/Options.svelte';
	import EventProperties from '$lib/Timeline/EventProperties.svelte';
	import CanvasProperties from '$lib/Timeline/CanvasProperties.svelte';
	import Caption from '$lib/Timeline/Caption.svelte';
	import XRange from '$lib/Timeline/XRange.svelte';
	// import DebugTimeline from "$lib/Timeline/DebugTimeline.svelte"
	import { windowWidth, touch } from '$lib/stores';

	export let dataset;
	export let settings;

	// Copy the object values - spread retains references so cannot be used
	// This ensures that the data is not inadvertently shared across instances
	// of this component
	dataset = JSON.parse(JSON.stringify(dataset));

	console.log('Timeline dataset', dataset);

	const options = {
		...Utils.initSettings(settings, dataset.start, dataset.end, [
			...dataset.eventsSubCats,
			...dataset.seriesSubCats
		]),
		selectedEvent: false,
		selectedPoint: false,
		zoom: 1,
		series: []
	};

	console.warn('options', options);

	let viewport;
	let viewportWidth = 0;
	let drawingWidth = 0;
	let scale = 0;

	// Adjust start and end values where have "-" start or end dates
	let startValue;
	let endValue;

	// Events, series and groups filtered by date range (search and subCats)
	// Filtering by subCats done in canvas component)
	let filteredEvents = [];
	let filteredSeries = [];
	let filteredGroups = [];

	// Wait for window to be mounted to test for touch devices
	onMount(() => {
		const msTouchEnabled = window.navigator.msMaxTouchPoints;
		const generalTouchEnabled = 'ontouchstart' in document.createElement('div');
		$touch = msTouchEnabled || generalTouchEnabled;
	});

	//
	// Reactive stuff
	//

	$: if ($windowWidth) handleResize();

	//
	// Functions
	//

	function handleOptions(event) {
		const detail = event.detail;
		// console.log('Options changed',detail)
		switch (detail.name) {
			case 'selectedPoint':
				options.selectedPoint = detail.data;
				break;
			case 'selectedEvent':
				options.selectedEvent = detail.data;
				break;
			case 'symbols':
				options.symbols = detail.data;
				break;
			case 'logScale':
				options.logScale = detail.data;
				break;
			case 'xRange':
				// console.log('resetting xRange')
				options.xRange = detail.data;
				options.selectedEvent = false;
				options.selectedPoint = false;
				scaleX();
				break;
			case 'filter':
				// console.log('Filtering')
				options.filter = detail.data;
				options.selectedEvent = false;
				options.selectedPoint = false;
				break;
			case 'categorise':
				options.categorise = detail.data;
				break;
			case 'totalise':
				options.totalise = detail.data;
				break;
			case 'sort':
				options.sort = detail.data;
				break;
			case 'search':
				options.search = detail.data;
				scaleX();
				break;
		}
		if (detail.name != 'search' && detail.name != 'category') {
			options.search = '';
		}
	}

	$: clickable = options.selectedEvent !== false || options.selectedPoint !== false;

	function handleClick() {
		// console.error('Handling timeline click in dataset',data.name)
		if (options.selectedEvent !== false) {
			options.selectedEvent = false;
		}
		if (options.selectedPoint !== false) {
			options.selectedPoint = false;
		}
	}

	const handleResize = Utils.debounce(() => {
		// console.log('Handling resize')
		if (viewport && viewport.clientWidth != viewportWidth) {
			// viewportWidth = viewport.clientWidth;
			scaleX();
			// console.warn('Set new viewport width', viewportWidth)
			// Non-intuitive behaviour on touch devices
			if ($touch == false) {
				if (options.selectedEvent) {
					setTimeout(scrollToSelected, 500);
				}
			}
		}
	}, 500);

	function scaleX() {
		// Viewport is the main drawing area which includes non-drawing
		// areas in the x-axis which are the left and right padding, though
		// the viewport itself is NOT padded using CSS
		viewportWidth = viewport.clientWidth;
		console.error('scaleX: viewPortWidth', viewportWidth);
		// Take off padding to get the drawing width
		drawingWidth = viewportWidth - Utils.CANVAS_PADDING_LEFT - Utils.CANVAS_PADDING_RIGHT;
		console.log('scaleX: drawingWidth', drawingWidth);
		console.log('scaleX: range', options.xRange.range);
		// scale in pixels/x-unit
		scale = drawingWidth / options.xRange.range;
		console.log('scaleX: scale (pixels/x unit)', scale);

		// @todo
		// startValue = options.xRange.start - paddingLeft / scale;
		startValue = options.xRange.start;
		endValue = options.xRange.end;

		console.warn('options', options);
		// console.log('data.events', data.events);
		filteredEvents = Utils.processEvents(
			dataset.events,
			scale,
			startValue,
			endValue,
			dataset.eventsSubCats,
			options.subCats,
			options.search
		);
		// console.log('filteredEvents', filteredEvents);
		// console.log('series',series,'groups',groups,'scale',scale)
		if (dataset.series.length > 0)
			filteredSeries = Utils.processSeries(dataset.series, scale, startValue, endValue);
		if (dataset.groups.length > 0)
			filteredGroups = Utils.processSeries(dataset.groups, scale, startValue, endValue);

		// Reset the x-axis based on filtered data
		dataset.xAxis = Utils.scaleXAxis(dataset.xAxis, drawingWidth, options.xRange);
		console.log('dataset.xAxis', dataset.xAxis);
	}

	function scrollToSelected() {
		if (options.selectedEvent) {
			const selectedElement = viewport.querySelector('.selected');
			if (selectedElement) {
				// console.log('scrolling into view')
				selectedElement.scrollIntoView({ block: 'start' });
				// console.log('scrolling into view')
			}
		}
	}
</script>

<!------------------------------------------------------------------------------
@section HTML
-------------------------------------------------------------------------------->

<!-- <DebugTimeline {data} {options} /> -->

<figure class="timeline">
	<div class="timeline-content" class:clickable on:click|stopPropagation={handleClick}>
		{#if options.readonly}
			<Caption {options} title={dataset.name} slug="/explore/{dataset.slug}" />
		{:else}
			<Options
				{options}
				xAxis={dataset.xAxis}
				xUnit={dataset.xUnit}
				seriesLength={dataset.series.length}
				eventsLength={dataset.events.length}
				on:optionsChanged={handleOptions}
			/>
		{/if}

		<!-- <div> -->
		<div class="viewport" bind:this={viewport}>
			{#if scale !== 0}
				{#if filteredEvents.length > 0}
					<Events
						events={filteredEvents}
						size={filteredEvents.length}
						{viewportWidth}
						{options}
						on:optionsChanged={handleOptions}
					/>
				{/if}

				{#if filteredSeries.length > 0}
					<Canvas
						series={filteredSeries}
						groups={filteredGroups}
						{viewportWidth}
						{drawingWidth}
						paddingLeft={Utils.CANVAS_PADDING_LEFT}
						{options}
						on:optionsChanged={handleOptions}
					/>
				{/if}

				<Axes xAxis={dataset.xAxis} {viewportWidth} {drawingWidth} />
			{/if}
		</div>
		<!-- </div> -->

		{#if scale !== 0 && options.readonly === false}
			<XRange xAxis={dataset.xAxis} {options} on:optionsChanged={handleOptions} />
		{/if}

		<!-- seriesSubCats={data.seriesSubCats}   -->
		<Legend
			eventsSubCats={dataset.eventsSubCats}
			{filteredEvents}
			{options}
			on:optionsChanged={handleOptions}
		/>

		<EventProperties selectedEvent={options.selectedEvent} on:optionsChanged={handleOptions} />

		<CanvasProperties {options} on:optionsChanged={handleOptions} />
	</div>
</figure>

<style>
	figure {
		margin: 3rem 0;
		width: 100%;
		overflow: hidden;
	}

	.timeline-content {
		padding: 1rem;
		background: var(--colour-chart-background);
		border: 1px solid var(--colour-chart-border);
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.viewport {
		position: relative;
		width: 100%;
		overflow: hidden;
		margin: 0;
		padding: 0;
	}

	.clickable {
		cursor: zoom-out;
	}
</style>
