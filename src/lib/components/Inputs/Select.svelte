<script>

    import { createEventDispatcher } from 'svelte'

    import { mobile } from '$lib/stores.js'

    const dispatch = createEventDispatcher()

    export let name
    export let label = ''
    export let first = ''   // Optional first option
    export let options      // Array of strings or array of value|label pairs
    export let value

    let processed = []

    if ( first ){
        processed.push({
            value: first.value ? first.value : first,
            label: first.label ? first.label : first
        })
    }

    options.forEach( option => {
        processed.push({
            value: option.value ? option.value : option,
            label: option.label ? option.label : option
        })
    })

</script>


{#if label }
    <label for={name}>{label}</label>
{/if}

<select {name} bind:value={value} on:change={()=>dispatch('changed')} class:mobile={$mobile}>
    {#each processed as option}
        <option value={option.value}>{option.label}</option>
    {/each}
</select>


<style>
    
    select {
        padding:var(--size-input-padding);
        border:1px solid var(--colour-input-border);
        border-radius:var(--size-input-border-radius);
        color:var(--colour-font);
        font-size:1rem;
    }

    select.mobile {
        flex-basis:100;
        flex-grow:1;
    }

    option {
        padding: 0;
    }
</style>