<script>

    import { createEventDispatcher } from 'svelte'

    import { mobile, touch } from '$lib/stores.js'

    const dispatch = createEventDispatcher()

    export let name = 'name'
    export let label = ''
    export let options = ['Off','On']
    export let value = false
    export let disabled = false

</script>


<!-- <p>Value = {value}</p> -->

<label for={name} class:mobile={$mobile}>

    <span class="label">{label}</span>

    <input type="checkbox" {name} id={name} bind:checked={value} {disabled}
           on:change={()=>dispatch('changed')}/>

    <span class="holder" class:disabled={disabled} class:touch={$touch}>

        <span class="toggle off" class:active={value==false}>
            {options[0]}
        </span>

        <span class="toggle on" class:active={value}>
            {options[1]}
        </span>

    </span>
</label>


<style>

    label {
        display:flex;
        align-items: center;
        /* padding:0.3rem 0.5rem; */
    }

    label.mobile {
        width:100%;
    }


    label.mobile .label{
        flex-basis:30%;
    }

    label.mobile .holder{
        flex-basis:70%;
    }
    
    input {
        display:none;
    }

    .holder {
        display:flex;
        margin-left:0.3rem;
    }

    .toggle {
        display:inline-block;
        margin:0;
        padding:0.3rem 0.5rem;
        border:1px solid var(--colour-faint-lines);
        color: var(--colour-font);
        cursor: pointer;
        text-transform: uppercase;
        font-size: 0.7rem;
        transition: all ease-in-out 300ms;
    }

    .off {
        border-radius:0.4rem 0 0 0.4rem;
        border-right:none;
    }

    .on {
        border-radius:0 0.4rem 0.4rem 0;
        border-left:none;
    }

    .active {
        background: var(--colour-toggle);
        color:white;
    }

    .holder:not(.disabled) span:not(.active):hover {
        background: var(--colour-toggle-hover);
        color: var(--colour-toggle-hover-font);
    }

    .holder.disabled span {
        opacity: var(--opacity-faint);
        cursor:default;
    }

</style>