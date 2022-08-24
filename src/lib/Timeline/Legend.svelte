<script>

    import { createEventDispatcher } from 'svelte'      

    import Symbol from '$lib/Timeline/Symbol.svelte'
    import Utils from '$lib/Utils'

    export let eventsSubCats
    export let options
    export let filteredEvents

    const dispatch = createEventDispatcher()


    function handleClick(filter){
        // console.log('handleClick with:\n  filter=',filter,'\n  options.filter=',options.filter)
        if ( filter != options.filter ){
            options.filter = filter
        } else {
            options.filter = ''
        }
        dispatch('optionsChanged',{name:'filter', data:options.filter})
    }


    function active( optionsFilter, filter, sel, index ){
        return (optionsFilter==filter) || (sel && sel.index==index)
    }

</script>


<!------------------------------------------------------------------------------
@section HTML
-------------------------------------------------------------------------------->

{#if (eventsSubCats.length > 0 && filteredEvents.length > 0) || options.series.length > 1}

    <aside>

        {#if eventsSubCats.length > 0 && filteredEvents.length > 0 }

            <div class="sub-categories">

                <span class="title">Event categories:</span>

                {#each eventsSubCats as cat, index}

                    {#if filteredEvents.find(e=>e.subCategory==cat)}

                        <span class="series" 
                            style:color={Utils.colour(index, index, options.categorise)}
                            class:active={options.search==cat} 
                            title="Click to highlight this event category"
                            on:click|stopPropagation={()=>handleClick(cat)} >

                            {cat}
                        </span>

                    {/if}

                {/each}

            </div>

        {/if}

        {#if options.series.length > 1 }

            <div class="series">

                <span class="title">{options.totalise ? 'Series categories' : 'Series'}:</span>

                {#each options.series as series, index}

                    {@const filter = options.totalise ? series.subCategory : series.name}
                
                    <span class="series" 
                        style:color={Utils.colour(index, series.colourIndex, options.categorise || options.totalise)}
                        class:active={active(options.search, filter, options.selectedPoint,index)} 
                        on:click|stopPropagation={()=>handleClick(filter)}
                        title="Click to highlight this series">

                        {#if options.symbols}

                            <span class="symbol">

                                <svg width="8" height="8">

                                    <g transform="translate(4,4)">

                                        <Symbol i={0} {index} 
                                                defaultColour={Utils.colour(index, series.colourIndex, options.totalise||options.categorise)}
                                                symbolIndex={series.symbolIndex} 
                                                symbols={options.symbols} 
                                                selectedPoint={false}/>
                                    </g>
                                </svg>

                            </span>

                        {/if}
                        
                        {series.name}

                    </span>

                {/each}
            </div>

        {/if}
        
    </aside>
{/if}

<!------------------------------------------------------------------------------
@section STYLES
-------------------------------------------------------------------------------->



<style>

    aside {
        margin-top:2rem;
        padding:0.5rem;
    }

    div.sub-categories,
    div.series {
        display:flex;
        flex-wrap: wrap;
        align-items: center;
        column-gap: 0;
        justify-content: center;
        width:100%;
        font-size:0.8rem;
    }

    span.title {
        padding-right:0.5rem;
    }

    span.series {
        display:flex;
        align-items: center;
        column-gap: 0;
        padding: 0.5rem 0 0.2rem 0;
        margin: 0 0.4rem;
        border-bottom:4px solid transparent;
        cursor: pointer;
        transition: all ease-in 300ms;
        text-align: center;
    }

    span.symbol {
        margin-right:0.2rem;
    }

    span.series:hover {
        border-color: var(--colour-legend-highlight);
    }

    span.series.active {
        border-color: inherit;
    }


</style>
