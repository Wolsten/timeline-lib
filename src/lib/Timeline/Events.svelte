<script>

    import Utils from '$lib/Utils'
    import Event from '$lib/Timeline/Event.svelte'

    export let events
    export let options
    export let viewportWidth
    export let size

    // console.error('events',events)
    
    const MIN_HEIGHT = 100
    const EVENT_HEIGHT = 20

	const margin = {
		top:20,
		left:Utils.CANVAS_PADDING_LEFT,
		right:Utils.CANVAS_PADDING_RIGHT,
		bottom:20
	}

    function eventsHeight(size){
        let h = size * EVENT_HEIGHT + margin.top + margin.bottom
        if ( h < MIN_HEIGHT ) h = MIN_HEIGHT
        // console.log('set height to',h)
        return h
    }

	function labelValues( e, w ){
		let x = e.width / 2
		let text = 'middle'
        let right = e.left + e.width
        // console.log('labelValues',e)
		if ( right > 0 && right < w * 0.7 ){
			text = 'right'
			x = e.width + 5
		} else if ( e.left > w * 0.3 && e.left < w){
			text = 'left'
			x = -5
		} else if ( e.left < 0 || right > w){
            text = 'middle'
            x =  w/2 - e.left
        }
        // console.warn('set',e.name, text, x)
		return {x, text}
	}



</script>


{#if viewportWidth }

    <svg class="events" width={viewportWidth} height={eventsHeight(size)}> 
        
        {#each events as event (event.id)}

            {@const label = labelValues(event,viewportWidth)}
 
            <Event {event} {label} {margin} height={EVENT_HEIGHT} {options} on:optionsChanged/>

        {/each}
        
    </svg>
{/if}


