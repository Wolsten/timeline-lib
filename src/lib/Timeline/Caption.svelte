<script>

    import LinkButton from '$lib/components/Inputs/LinkButton.svelte'

    export let title
    export let options
    export let slug

    // console.log('slug',slug)

    let mainTitle = ''
    let subTitle = ''

    if ( options.title ){
        mainTitle = options.title
    } else {
        mainTitle = title
    }

    $: if ( options.series.length > 1 ) {
        let comments = []
        if ( options.totalise ){
            comments.push('grouped by category')
        } else {
            comments.push('all types')
        }
        if (comments.length > 0 ){
            subTitle = `(${comments.join(', ')})`
        }
    }


</script>


<figCaption>

    <h3>
        {mainTitle}
        
        {#if subTitle}
            <span class="subtitle">{subTitle}</span>
        {/if}
    </h3>

    <div class="button">
        <LinkButton {slug} label={'Explore'} external={false}/>
    </div>
    
</figCaption>



<style>

    figCaption {
        width:100%;
        margin-bottom:1rem;
        font-weight:bold;
        position:relative;
    }

    h3 {
        padding:0;
        margin:0;
        max-width: 75%;
        color:var(--colour-font);
    }


    span.subtitle {
        /* display:block; */
        padding:0;
        font-size: 1rem;
        font-weight: normal;
        color:var(--colour-font);
    }

    .button {
        position:absolute;
        top:0;
        right:0;
    }

</style>