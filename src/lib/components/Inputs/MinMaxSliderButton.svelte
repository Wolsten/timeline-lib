
<script>

    import { touch, windowWidth } from '$lib/stores';
    import { createEventDispatcher } from 'svelte'

    export let value
    export let min
    export let max
    export let type
    export let labels
    
    const dispatch = createEventDispatcher()

    let width
    let holder
    let xOffset = 0
    let dragging = false
    let interval = 0
    let newValue = value
    let label = ''

    // Get the width of the slider container - this elements parent
    // and the size of the scrolling interval
    $: if ( $windowWidth && holder && holder.parentNode ){ 
        width = holder.parentNode.offsetWidth
        // console.error('offset width of parent node', width)
        interval = parseInt(width / labels.length)
        // console.log('width',width,'interval',interval)
    }

    // Update new value when the value changes
    $: if ( value != -1 ){
        newValue = value 
        label = value
    }


 
    function handleDragStart(){

        if ( $touch ){
            return
        }

        dragging = true

        const minX = min * interval
        const maxX = max * interval
        // console.log('min',min,'max',max)

        // Get the width of the slider container - this elements parent
        // width = holder.parentNode.offsetWidth
        // console.error('offset width of parent node', width)

        // Get the position relative to the viewport
        const rect = holder.parentNode.getBoundingClientRect()
        xOffset = rect.left
        // console.log('rect left',rect.left)

        // interval = parseInt(width / size)
        // console.log('width',width,'interval',interval)

        document.body.onmousemove = moveEvent => {
            // console.log('Dragging', moveEvent.offsetX)
            // Get the new delta position within the slider div
            // console.log('clientX', moveEvent.clientX)
            let x = moveEvent.clientX - xOffset
            // The dynamic position p is the left hand side
            // since user will typically grab in the middle.
            // let p = x - holder.clientWidth/2
            let p = x - interval / 2 - 5

            // console.log('minX',minX,'maxX',maxX,'p',p)
            // Check against limits and if ok set position       
            if ( p < minX){
                p = minX
            } else if ( p > maxX){
                p = maxX
            } 
            newValue = p / interval
            label = Math.floor(newValue)
            // console.log('min, p, max, newValue = ',minX,p,maxX,newValue)
            
        }

        const drop = function(){
            dragging = false
            document.body.onmousemove = null
            document.body.onmouseup = null
            document.body.onmouseleave = null

            value = Math.floor(newValue)
            // console.log('Drag ended, final value = ',value)

            dispatch('rangeChanged', {type, value})
        }

        document.body.onmouseup = e => {
            drop()
        }

        document.body.onmouseleave = e => {
            drop()
        }
    }

    function handleTouchDown(){
        value--
        dispatch('rangeChanged', {type, value})
    }

    function handleTouchUp(){
        value++
        dispatch('rangeChanged', {type, value})
    }



</script>


{#if $touch}

    <div class="touch">

        {#if value > min}
            <button type="button" on:click|stopPropagation={handleTouchDown}>
                &#9664;
            </button>
        {:else}
            &nbsp;
        {/if}

        {labels[value]}

        {#if value < max}
            <button type="button" on:click|stopPropagation={handleTouchUp}>
                &#9654;
            </button>
        {:else}
            &nbsp;
        {/if}
    </div>

{:else}

    <div bind:this={holder} 
         class="draggable" class:dragging={dragging} 
         style={`min-width:${interval}px; left:${interval * newValue}px`}
         on:mousedown={handleDragStart} >

        {labels[label]}

    </div>

{/if}


<style>

    div {
        position:absolute;
        top:0rem;

        padding:0.2rem 0.4rem;

        border-radius:1rem;
        border: 1px solid var(--colour-faint-lines);
        background-color: var(--colour-range-slider-fill);
        color:var(--colour-font);

        min-width:50px;
        font-size:0.8rem;
        text-align:center;
    }

    div.draggable {
        top:-0.5rem;
    }

    div.touch {
        position:static; 
    }

    div.dragging {
        background-color: var(--colour-toggle);
        color:white;
        cursor:col-resize;
    }

    div:hover,
    button:hover {
        background-color: var(--colour-toggle-hover);
        color:white;
    }

    button {
        padding:0;
        border:none;
        background-color: inherit;
        color: inherit;
        display:inline-block;
        position:static;
        text-align: center;
        font-size:1rem;
    }

</style>