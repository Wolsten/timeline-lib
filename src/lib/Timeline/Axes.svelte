<script>
	import { fade } from 'svelte/transition';

	import Utils from '$lib/Utils.js';

	export let xAxis;
	export let viewportWidth;
	export let drawingWidth;

	// console.table(xAxis)

	const AXIS_HEIGHT = 30;
	const MAJOR_TICK_Y1 = -4;
	const MAJOR_TICK_Y2 = 6;
	// const MINOR_TICK_Y2 = 14

	// console.log('padding left',paddingLeft)
</script>

<!------------------------------------------------------------------------------
@section HTML
-------------------------------------------------------------------------------->
<!-- <p>viewportWidth={viewportWidth}, drawingWidth={drawingWidth}, nTicks={xAxis.majorTicks.length}</p> -->

<svg class="axis" width={viewportWidth} height={AXIS_HEIGHT} transition:fade>
	<line
		class="svg-major"
		x1={Utils.CANVAS_PADDING_LEFT}
		y1={MAJOR_TICK_Y1}
		x2={Utils.CANVAS_PADDING_LEFT + drawingWidth}
		y2={MAJOR_TICK_Y1}
	/>

	{#each xAxis.majorTicks as x, majorIndex}
		<line class="svg-major-tick" x1={x} y1={MAJOR_TICK_Y1} x2={x} y2={MAJOR_TICK_Y2} />

		<text class="svg-major-label" x={x - Utils.MIN_BOX_WIDTH / 4} y={MAJOR_TICK_Y2 + 14}>
			{Utils.formatYear(xAxis.majorLabels[majorIndex])}
		</text>

		<!-- {#if majorIndex < svgMajorTicks.length - 1 && svgMinorTicks.length > 0}
        
            {#each svgMinorTicks as deltaX, minorIndex}

                {#if minorIndex > 0 }
                    <line class="svg-minor-tick" x1="{x+deltaX}" y1="{MAJOR_TICK_Y1}" x2="{x+deltaX}" y2="{MINOR_TICK_Y2}"/>
                {/if}
                
                {#if svgMinorLabels[minorIndex] !== undefined }
                    <text class="svg-minor-label" x="{x+deltaX+minorGap/2-8}" y="{MAJOR_TICK_Y1+12}">{@html svgMinorLabels[minorIndex]}</text>
                {/if}
            {/each}

        {/if} -->
	{/each}
</svg>

<!------------------------------------------------------------------------------
@section STYLES
-------------------------------------------------------------------------------->
<style>
	svg {
		overflow: visible;
		display: block;
		position: relative;
		z-index: 1;
	}

	.svg-major {
		stroke-width: 1;
		stroke: gray;
	}

	.svg-major-tick {
		stroke-width: 2;
		stroke: gray;
	}

	.svg-major-label {
		fill: var(--colour-font);
		font-size: 0.8rem;
	}

	/* .svg-minor-tick {
        stroke-width: 1;
        stroke: gray;
    }

    .svg-minor-label {
        font-size: 0.8rem;
    } */
</style>
