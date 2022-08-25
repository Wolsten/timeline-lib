<script>
	import { createEventDispatcher } from 'svelte';

	// import Utils from '$lib/Utils.js';
	import MinMaxRangeSlider from '$lib/components/Inputs/MinMaxRangeSlider.svelte';
	import Utils from '$lib/Utils.js';

	export let xAxis;
	export let options;

	// console.table(options)

	const dispatch = createEventDispatcher();

	// Save the original axis
	let fullAxis = { ...xAxis };

	console.warn('fullAxis', fullAxis, '\noptions', options);

	//console.table(fullAxis);

	let minValue = 0;
	let maxValue = fullAxis.values.length - 1;
	let start = 0;
	let end = 0;

	$: if (xAxis) setValues();

	function setValues() {
		// labels = xAxis.labels
		start = options.xRange.start;
		end = options.xRange.end;

		// console.log('max',maxValue)
		// console.log('start', start);
		// console.log('end', end);

		// Find the min value
		for (let i = 0; i < fullAxis.values.length - 1; i++) {
			if (start >= fullAxis.values[i]) {
				minValue = i;
			}
		}
		// Find the max value - defaults to the last value
		maxValue = fullAxis.values.length - 1;
		// Loop around all but the last value
		for (let i = fullAxis.values.length - 2; i > minValue; i--) {
			if (end >= fullAxis.values[i]) {
				// Find out which interval it is nearest to - this one or the next
				const deltaBefore = end - fullAxis.values[i];
				const deltaAfter = fullAxis.values[i + 1] - end;
				maxValue = deltaBefore <= deltaAfter ? i : i + 1;
				break;
			}
		}
		// console.log('max value', maxValue);
	}

	function handleRange(event) {
		console.warn('Handling date range changed by child', event.detail);

		if (event.detail.type == 'min') {
			// console.log('new start value', event.detail.value )
			options.xRange.start = fullAxis.values[event.detail.value];
			options.xRange.range = options.xRange.end - options.xRange.start;
			start = options.xRange.start;
			minValue = event.detail.value;
		} else if (event.detail.type == 'max') {
			// console.log('new end value', event.detail.value )
			options.xRange.end = fullAxis.values[event.detail.value];
			options.xRange.range = options.xRange.end - options.xRange.start;
			end = options.xRange.end;
			maxValue = event.detail.value;
		}
		console.log('XRange: handleRange', options.xRange);
		dispatch('optionsChanged', { name: 'xRange', data: options.xRange });
	}
</script>

<div
	style="padding-left:{Utils.CANVAS_PADDING_LEFT}px; 
	       padding-right:{Utils.CANVAS_PADDING_RIGHT}px;"
>
	<MinMaxRangeSlider labels={fullAxis.labels} {minValue} {maxValue} on:rangeChanged={handleRange} />
</div>

<style>
	div {
		width: 100%;
		margin-top: 0.3rem;
		/* box-sizing: content-box; */
	}
</style>
