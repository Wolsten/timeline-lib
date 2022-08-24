<script>


    import {mobile} from '$lib/stores.js'
    import Utils from '$lib/Utils'

    export let post

    const {created} = Utils.getVersionHistory(post.meta?.history)
    const status = post.meta?.categories?.includes('draft') ? 'DRAFT' : 'Published'
    // const status = 'Published'

    // console.log('post.path',post)
    // console.log({created})


    
</script>


<article class:mobile={$mobile}>

    <a href="{post.path}">
        <img src={post.meta.image} alt="" />
        <header>
            <h2>{post.meta.title}</h2>
            <p>{status} {created ? created.toLocaleDateString() : 'Missing'}</p>
        </header>
        <div class="body">
            <p>{post.meta.summary}</p>
        </div>
    </a>
</article>


<style>

    article {
        padding:0;
        margin:0.8rem;
        height: var(--size-post-height);
        max-width: 600px;
        flex-grow:1;
        background-image: linear-gradient( 180deg,  
            rgba(0,0,0,0.7) 0%, 
            rgba(0,0,0,0) 20%, 
            rgba(0,0,0,0) 55%,
            rgba(0,0,0,0.5) 70%,
            rgba(0,0,0,0.7) 100%
        );
        color: var(--colour-post);
    }

    article.mobile {
        max-width: 100%;
        width: 100%;
        margin: 0.3rem 0;
    }

    article:hover {
        background-image: linear-gradient( 180deg,  
            rgba(0,0,0,0.8) 0%, 
            rgba(0,0,0,0) 20%, 
            rgba(0,0,0,0) 55%,
            rgba(0,0,0,0.6) 70%,
            rgba(0,0,0,0.8) 100%
        );
        color:var(--colour-post-hover);
    }

    header, .body {
        padding:0 1rem;
    }

    header h2 {
        margin: 0.5rem 0 0 0;
        text-transform: uppercase;
    }

    header p {
        margin:0;
        font-size: 0.9rem;
        line-height: 1.2rem;

        /* color: var(--colour-post); */
    }



    a {
        position:relative;
        display:flex;
        justify-content: space-between;
        flex-direction: column;
        text-decoration: none;
        height:100%;
        overflow:hidden;
    }

    a img {
        position:absolute;
        z-index:-1;
        object-fit:cover;
        height:100%;
        width:100%;
        transition: all ease-in-out 300ms;
    }

    h2, p {
        color:var(--colour-post);
    }

    article:hover h2,
    article:hover p {
        color:var(--colour-post-hover);
    }

    article:hover img {
        transform: scale(110%,110%);
    }

    article .body p {
        max-width: 400px;
    }
</style>