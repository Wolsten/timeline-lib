<script>

    export let label
    export let slug
    export let external = true

</script>




<!-- <a rel="external" href="/explore/{slug}">{label}</a> -->
{#if external}
    <a rel="external" href="{slug}">{label}</a>
{:else}
    <a href="{slug}">{label}</a>
{/if}



<style>

    a, a:hover, a:active, a:visited {
        display:inline-block;
        color:var(--colour-font);
        text-decoration: none;
        outline:none;
        font-size: normal;
    }

    a {
        border:1px solid var(--colour-input-border);
        background: var(--colour-background);
        border-radius: var(--size-input-border-radius);
        padding:var(--size-input-padding);
        font-size:1rem;
        font-weight:normal;
    }


    a:hover {
        background-color: var(--colour-input-border);
        color:white;
    }

</style>