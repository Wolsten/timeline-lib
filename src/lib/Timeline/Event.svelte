<script>

	import { createEventDispatcher } from 'svelte'

	import Utils from '$lib/Utils'

	export let event
	export let label
	export let options
	export let margin
	export let height

	const dispatch = createEventDispatcher()

	let lastClickedMs = 0


	function rectColour(filter){
		// console.log(sel,event)
		if ( filter != undefined && filter != '' ){
			if ( filter == event.subCategory ){
				return event.colour
			}
			return Utils.COLOUR_INACTIVE
		}
		return event.colour
	}


	function handleDeferredClick(){

		if ( options.selectedEvent )
		dispatch('optionsChanged', {name:'selectedEvent', data:options.selectedEvent})

	}


    function handleClick(){

		let clickMs = Date.now()

		// console.log('event handling click to select',event)
        if ( options.selectedEvent === false || 
             options.selectedEvent.index !== event.index ){

            options.selectedEvent = {...event}
			lastClickedMs = clickMs
			setTimeout( handleDeferredClick, 500)
			
        } else {

			// Check for double click in analysis mode
			if ( options.readme===false && lastClickedMs && (clickMs - lastClickedMs) < 500 ) {
				options.zoomIn()
			} else {
            	options.selectedEvent = false
				dispatch('optionsChanged', {name:'selectedEvent', data:options.selectedEvent})
			}

			lastClickedMs = 0
        }
    }



</script>


<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<g transform="translate({event.left}, {margin.top + (options.sort=='x' ? event.xOrder : event.cOrder) * height})" 
   style="--event-rect-colour: { rectColour(options.filter) };"
   class:selected={options.selectedEvent && options.selectedEvent.index==event.index}
   on:click|stopPropagation={ handleClick }
   >

	<rect x={0} y={-height/2} width={event.width} height={height*0.9} />

	<text x={label.x} class={label.text} y={height/7}>
		{event.name}
	</text>

</g>




<style>

	g {
		transition: transform ease-in-out 500ms;
	}

	g:hover rect {
		cursor: pointer;
		fill:var(--colour-toggle-hover);
	}

	g:hover text {
		font-weight:bold;
		cursor: pointer;
		fill:var(--colour-link);
	}

	g:hover text.middle {
		fill:white;
	}


	/* Using a variable set in the tag style allows the text fill colour to override
	   otherwise text would be same colour as the rectangle */
	rect {
		fill:var(--event-rect-colour);
	}

	text {
		text-anchor:start;
		font-size:0.8rem;
		fill:var(--colour-text);
	}

	text.middle {
		fill:white;
		text-anchor:middle;
	}

	text.left {
		text-anchor:end;
	}


</style>