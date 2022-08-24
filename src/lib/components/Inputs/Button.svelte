<script>

    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let label = ''
    export let disabled = false


</script>


<button type="button" {disabled} on:click|stopPropagation={()=>dispatch('clicked')}>
    {label}
</button>


<style>
    
    button {
        background: var(--colour-background);
        border:1px solid var(--colour-input-border);
        border-radius:var(--size-input-border-radius);
        padding:var(--size-input-padding);
        color:var(--colour-font);
        margin:0;
        cursor: default;
    }

    button:disabled {
        opacity: var(--opacity-faint);
    }

    button:not(:disabled):hover {
        background: var(--colour-toggle-hover);
        color:white;
        cursor: pointer;
    }

</style>