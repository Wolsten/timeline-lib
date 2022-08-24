<script>
    
    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition';

    import Utils from '$lib/Utils'
    import {mobile} from '$lib/stores.js'
    import Button from '$lib/components/Inputs/Button.svelte'

    export let selectedEvent

    const dispatch = createEventDispatcher()

    function handleClick(){
        // console.log('Clicking props')
        selectedEvent = false
        dispatch('optionsChanged',{name:'selectedEvent',data:selectedEvent})
    }


</script>



<!------------------------------------------------------------------------------
@section HTML
-------------------------------------------------------------------------------->


{#if selectedEvent !== false }

    <div class="properties" class:mobile={$mobile} transition:slide>

        {#if selectedEvent.index != -1 }

            <!-- <button type="button" on:click={handleClick}>
                Close
            </button> -->
            <div class="button">
                <Button label="Close" on:clicked={handleClick}></Button>
            </div>
            
            <h3>
                {selectedEvent.name} 
                <span>{Utils.eventDates(selectedEvent)}</span>
            </h3>
        
            <div class="summary">{@html selectedEvent.summary}</div>
        
            {#if selectedEvent.citations}
                <h3>Find out more</h3>
                <div>{@html selectedEvent.citations}</div>
            {/if}

        {/if}

    </div>

{/if}


<!------------------------------------------------------------------------------
@section STYLES
-------------------------------------------------------------------------------->


<style>

    .properties {
        font-size:1rem;
        line-height: 1.4rem;
        position:absolute;
        bottom:0.5rem;
        left:0.5rem;
        background:white;
        width:50%;
        max-height:96%;
        padding:0.5rem;
        border: 1px solid var(--colour-box-shadow);
        box-shadow: 0.2rem 0.2rem 0.3rem var(--colour-box-shadow);
        z-index: 2;
        overflow-y: scroll;
    }

    .properties.mobile {
        top:0;
        left:0;
        width:100%;
        /* max-height: 50%; */
        max-height:50vh;
    }

    h3 span {
        font-size: smaller;
    }

    h3 {
        font-size: 1.2rem;
        font-weight: normal;
    }

    .button {
        float:right;
    }


</style>