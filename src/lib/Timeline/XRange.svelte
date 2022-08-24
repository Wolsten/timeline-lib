<script>
	import { createEventDispatcher } from 'svelte';

	import MinMaxRangeSlider from '$lib/components/Inputs/MinMaxRangeSlider.svelte';
	// import Utils from '$lib/Utils.js'

	export let xAxis;
	export let options;
	export let paddingLeft;
	export let paddingRight;

	// console.table(options)

	const dispatch = createEventDispatcher();

	// Save the original axis
	let fullAxis = { ...xAxis };

	//console.table(fullAxis);

	let minValue = 0;
	let maxValue = fullAxis.majorAxis.length - 1;
	let start = 0;
	let end = 0;

	$: if (xAxis) setValues();

	function setValues() {
		// labels = xAxis.majorLabels
		start = options.xRange.start;
		end = options.xRange.end;

		// console.log('max',maxValue)
		console.log('start', start);
		console.log('end', end);

		for (let i = 0; i < fullAxis.majorAxis.length - 1; i++) {
			if (start >= fullAxis.majorAxis[i]) {
				// console.log('start',start, 'major',fullAxis.majorAxis[i])
				minValue = i;
				// console.log('minValue',minValue)
			}
		}

		maxValue = minValue + 1;
		for (let i = fullAxis.majorAxis.length - 1; i > minValue; i--) {
			if (end >= fullAxis.majorAxis[i]) {
				maxValue = i;
				break;
			}
		}

		// console.log('max',maxValue)
		// console.log('majorAxis, min & max values', fullAxis.majorAxis, minValue, maxValue)
	}

	function handleRange(event) {
		console.warn('Handling date range changed by child', event.detail);

		if (event.detail.type == 'min') {
			// console.log('new start value', event.detail.value )
			options.xRange.start = fullAxis.majorAxis[event.detail.value];
			options.xRange.range = options.xRange.end - options.xRange.start;
			start = options.xRange.start;
			minValue = event.detail.value;
		} else if (event.detail.type == 'max') {
			// console.log('new end value', event.detail.value )
			options.xRange.end = fullAxis.majorAxis[event.detail.value];
			options.xRange.range = options.xRange.end - options.xRange.start;
			end = options.xRange.end;
			maxValue = event.detail.value;
		}

		dispatch('optionsChanged', { name: 'xRange', data: options.xRange });

		// console.log('major axis',majorAxis)
		// console.log('new date range', options.xRange)
	}
</script>

<div style="padding-left:{paddingLeft}px; padding-right:{paddingRight}px;">
	<MinMaxRangeSlider
		labels={fullAxis.majorLabels}
		{minValue}
		{maxValue}
		on:rangeChanged={handleRange}
	/>
</div>

<style>
	div {
		width: 100%;
		margin-top: 0.3rem;
		/* box-sizing: content-box; */
	}
</style>
