<script>

    import OpenGraph from '$lib/components/OpenGraph.svelte'
    import {windowWidth} from '$lib/stores.js'

    export let image = '/images/jr-korpa-fi5FPDZ6tns-unsplash-thumb.jpg'
    export let imageCredit = 'Photo by <a href="https://unsplash.com/@jrkorpa?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jr Korpa</a> on <a href="https://unsplash.com/collections/_Giamd8z4so/baffled-by-science/4aae626d376a8f46f5d4b78d1223a71c?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>'
    export let title
    export let description = "For those frustrated by media coverage of science and technology and how it is translated into policy by government."
    export let overlayTitle = false

    let sizedImage = image

    $: if ( $windowWidth >= 600 ){
        sizedImage = image.replace('thumb','banner')
    }

    imageCredit = imageCredit.replace(/href/i, ' target="_blank" href')

</script>


<OpenGraph {title} {description} {image} />   

{#if overlayTitle}

    <div class="overlay">
        <img src={sizedImage} alt="">
        <h1>{title}</h1>
    </div>
    <p>{@html imageCredit}</p>

{:else}

    <div class="normal">
        <img src={sizedImage} alt="">
        <p>{@html imageCredit}</p>
    </div>


{/if}



<style>

    div {
        position:relative;
        width:100%;
    }

    h1 {
        position: absolute;
        bottom:1rem;
        left:0;
        padding:0 1rem 0 1rem;
        margin:0;
        color:white;
    }

    div.overlay {
        max-height:160px;
    }

    div img {
        width:100%;
        height:160px;
        object-fit:cover;
    }

    p {
        width:100%;
        padding:0 1rem;
        margin:0;
        font-size:0.8rem;
        line-height: 1.4rem;
        color:var(--colour-font-faint);
    }

    :global(a) {
        color:var(--colour-link);
        text-decoration: none;
    }

    :global(a:hover){
        color:var(--colour-link-hover);
    }

</style>