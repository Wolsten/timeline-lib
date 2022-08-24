<script>

    import {containerWidth} from '$lib/stores'  

    export let type = 'other'
    export let caption = ''
    export let source

    const DEFAULT_GOOGLE_MAP_SIZE = {width:600,height:450}
    const DEFAULT_YOUTUBE_SIZE = {width:600,height:400}

    let width = 400
    let height = 300

    $: if ( $containerWidth ){
        width = $containerWidth
        // console.log('set new container width',width)
        if ( type=='googlemap'){
            height = width * DEFAULT_GOOGLE_MAP_SIZE.height / DEFAULT_GOOGLE_MAP_SIZE.width
        } else if ( type === 'youtube' ){
            height = width * DEFAULT_YOUTUBE_SIZE.height / DEFAULT_YOUTUBE_SIZE.width
        }
    }


</script>

<figure>

    {#if type === 'img' }
        
        <img src={source} alt={caption} />

    {:else if type === 'youtube' }

        <iframe class="youtube" src={source} title={caption} {width} {height}
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>

    {:else if type === 'googlemap' }

        <iframe src={source} {width} {height} title={caption} allowfullscreen="" loading="lazy"></iframe>

    {:else if type === 'other'}

        <iframe src={source} title={caption} ></iframe>

    {/if}

    {#if caption}
        <figCaption>{caption}</figCaption>
    {/if}
</figure>   



<style>

    figure {
        display:block;
        max-width: 100%;
        text-align: center;
        margin: 3rem 0;
    }

    figure img {
        max-width: 100%;
        height:auto;
    }

    iframe {
        display:block;
        overflow: hidden;
    }

</style>

