<script>

    import { page } from '$app/stores'
    import Utils from '$lib/Utils.js'

    export let title = "Baffled by Science"
    export let description = "For those frustrated by media coverage of science and technology and how it is translated into policy by government."
    export let image = '/images/jr-korpa-fi5FPDZ6tns-unsplash-thumb.jpg'
    
    const PATH = $page.url.pathname
    const URL = Utils.SITE + PATH

    // console.log('page',$page)

</script>



<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description}>
    <!-- Open graph meta data. Test with:
         https://developers.facebook.com/tools/debug/ -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={URL} />
    <meta property="og:image" content={Utils.SITE+image} />
    <!-- Twitter card data. Validator: 
         https://cards-dev.twitter.com/validator -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content={URL} />
    <meta name="twitter:creator" content="@BaffledBySci" />
    <!-- <meta name="twitter:title" content={title}  />
    <meta name="twitter:description" content={description}  />
    <meta name="twitter:image" content={SITE+image} /> -->
</svelte:head>
