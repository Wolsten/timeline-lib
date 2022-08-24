<script>
    
    import { createEventDispatcher } from 'svelte'
    import { slide } from 'svelte/transition';
    import { afterUpdate }  from 'svelte'

    import Utils from "$lib/Utils.js"

    export let options

    const dispatch = createEventDispatcher()

    let table


    function selectPoint(i){
        options.selectedPoint.i = i
        dispatch('optionsChanged',{name:'selected', data:options.selectedPoint})
    }


    afterUpdate(() => {
        if ( table){
            const active = table.querySelector('.active')
            if ( active ){
                active.scrollIntoView({block:'center'})
            }
        } else {
            table = undefined
        }
    })

// $: console.log('selectedPoint',options.selectedPoint )
 

</script>



<!------------------------------------------------------------------------------
@section HTML
-------------------------------------------------------------------------------->


{#if options.selectedPoint !== false}
    
    <div class="properties" transition:slide>

        <h3>Data series: {options.selectedPoint.name}</h3>

        <div class="table">

            <header>
                <div>Value</div>
                <div class="date">Date</div>
            </header>

            <div class="body" bind:this={table}>

                {#if options.series[options.selectedPoint.index] != undefined }

                    {#each options.series[options.selectedPoint.index].data as point}

                        <div class="col" class:active={options.selectedPoint.i==point.i}
                                on:click|stopPropagation={()=>selectPoint(point.i)}>

                            <div>{Utils.formatNumber(point.value)}</div>
                            <div class="x">{point.xLabel}</div>
                        </div>

                    {/each}
                    
                {/if}

            </div>

        </div>

        {#if options.selectedPoint.citations}
            <h4>Source</h4> 
            {@html options.selectedPoint.citations}
        {/if}
    </div>

{/if}


<!------------------------------------------------------------------------------
@section STYLES
-------------------------------------------------------------------------------->


<style>

    .properties {
        font-size:0.9rem;
        line-height: 1.2rem;
    }

    h3 {
        font-size: 1rem;
    }

    h4 {
        margin-bottom:0.2rem;
    }

    /* Use adjacent sibling abd global selector to target the citation p element */
    h4 + :global(p) {
        margin:0;
        line-height: 1.2rem;
    }

    .table {
        width:100%;
        display:flex;
    }

    .table header {
        padding:0.3rem 0.5rem;
        font-weight: bold;
    }

    .table .body {
        display:flex;
        overflow-x:scroll;
        padding-bottom:1rem;
    }

    .x {
        padding-top:0.5rem;
    }

    .col {
        border-radius:0.5rem;
        padding:0.3rem 0.5rem;
        text-align:right;
    }

    .col:not(.active):hover {
        background-color: var(--colour-legend-highlight);
        color:var(--colour-background);
        cursor: pointer;
    }

    .col.active {
        background-color: var(--colour-legend-active);
        color:var(--colour-background);
        cursor: default;
        font-weight:bold;
    }


</style>