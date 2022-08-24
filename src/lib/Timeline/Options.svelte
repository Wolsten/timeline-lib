<script>

    import { createEventDispatcher } from 'svelte'

    import Select from '$lib/components/Inputs/Select.svelte'
    import Button from '$lib/components/Inputs/Button.svelte'
    import TextSearch from '$lib/components/Inputs/TextSearch.svelte'
    import Toggle from '$lib/components/Inputs/Toggle.svelte'


    export let xAxis
    export let seriesLength
    export let eventsLength
    export let options

    // console.log('seriesLength',seriesLength)

    const dispatch = createEventDispatcher()

    options.zoomIn = ()=>{
        handleZoomIn(true)
    }

    function handleZoomIn(focus){

        // console.log('Clicked event zoom in - selected=', options.selectedEvent)

        if ( focus ){

            // console.log('Clicked focus')

            // Only respond if selected is set
            if ( options.selectedEvent ){ 

                options.xRange.start = options.selectedEvent.startDate.decimal

                if ( options.selectedEvent.endDate ){
                    options.xRange.end = options.selectedEvent.endDate.decimal
                } else {
                    // Calculate a sensible range if no end date
                    let pseudoEnd = options.xRange.start + xAxis.majorRange/20
                    if ( pseudoEnd > xAxis.majorLast ){
                        pseudoEnd = xAxis.majorLast
                    }
                    options.xRange.end = parseInt(pseudoEnd)
                }

                options.xRange.range = options.xRange.end - options.xRange.start

                // console.log('options.xRange',options.xRange)

                dispatch('optionsChanged', {name:'xRange', data:options.xRange})
            }

        } else {

            options.selectedEvent = false
            options.search = ''
            options.filter = ''

            // options.zoom = 1
            options.xRange = {
                start : xAxis.majorFirst,
                end : xAxis.majorLast,
                range : xAxis.majorRange
            }

            dispatch('optionsChanged', {name:'selectedEvent', data:options.selectedEvent})
            dispatch('optionsChanged', {name:'xRange', data:options.xRange})
        }

        // console.error('xRange', dateRange)
    }



</script>


<div class="form">

    {#if options.readonly === false}

        {#if seriesLength>0}

            <Toggle name="symbols" label="Symbols" bind:value={options.symbols}
                    on:changed={dispatch('optionsChanged', {name:'symbols', data:options.symbols})} />

            <!-- @todo
                The scaling needs updating to handle negative values 
                <Toggle name="logScale" label="Scale" bind:value={options.logScale}
                    options={['Linear','Log']}
                    on:changed={dispatch('optionsChanged', {name:'logScale', data:options.logScale})} /> -->

        {/if}

        {#if seriesLength > 1 }

            <Toggle name="categorise" label="Colour by" bind:value={options.categorise}
                    options={['Series','Category']}
                    disabled={options.totalise}
                    on:changed={dispatch('optionsChanged', {name:'categorise', data:options.categorise})} />

            <Toggle name="totalise" label="Grouping" bind:value={options.totalise}
                    on:changed={()=>{
                        dispatch('optionsChanged', {name:'totalise', data:options.totalise})
                        if ( options.totalise ){
                            options.categorise = true
                            dispatch('optionsChanged', {name:'categorise', data:options.categorise})
                        }
                    }} />
        {/if}

    {/if}

    {#if eventsLength > 0 }

        <Select 
            name="category" 
            bind:value={options.sort} 
            options={[
                    {value:'x',label: `Sort by ${xAxis.xUnit}`},
                    {value:'category', label: 'Sort by category'}
                ]} 
                on:changed={()=>dispatch('optionsChanged', {name:'sort', data:options.sort})} />

        <TextSearch 
            placeholder="Find event" 
            bind:search={options.search}
            on:search={ () => {
                dispatch('optionsChanged', {name:'search', data:options.search})
            }}
            on:clear={ ()=> {
                options.selectedEvent = false
                dispatch('optionsChanged', {name:'search', data:options.search})
                dispatch('optionsChanged', {name:'selectedEvent', data:options.selectedEvent})
            }} 
        />

    {/if}

    <div class="buttons">

        {#if eventsLength > 0 }

            <Button 
                label="Focus" 
                disabled={options.selectedEvent==false} 
                on:clicked={()=>handleZoomIn(true)}/>
        {/if}

        <Button label="Reset" 
                disabled={options.xRange.start==xAxis.majorFirst && 
                            options.xRange.end==xAxis.majorLast && 
                            options.filter == '' &&
                            options.search == ''} 
                on:clicked={()=>handleZoomIn(false)}/>
    </div>
        
</div>




<style>

    .form {
        width:100%;
        display:flex;
        justify-content: space-around;
        /* justify-content: flex-start; */
        flex-wrap: wrap;
        align-items: center;
        margin-bottom:0.5rem;
        gap:0.5rem;
    }

    .form :global(>*){
        font-size:0.8rem;
    }

    .buttons {
        display:flex;
        justify-content: flex-end;
        column-gap: 1rem;
        flex-grow:2;
        padding:0.5rem;
    }

</style>