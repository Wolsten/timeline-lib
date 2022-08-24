<script>

    import { slide } from 'svelte/transition'
    import { desktop, mobile } from '$lib/stores.js'

    export let path
    export let nav

    const menu = [
        {
            href: '/',
            label: 'Home'
        },
        {
            href: '/timelines',
            label: 'Timelines'
        },
        {
            href: '/contact',
            label: 'Contact'
        },
        {
            href: '/about',
            label: 'About'
        },
        // {
        //     href: '/datasets',
        //     label: 'Datasets'
        // },
        // {
        //     href: '/contact',
        //     label: 'Contact'
        // }
    ]

    let show = false

    nav.reset = () => {
        // console.log('resetting')
        if ( show ) show=false
    }

    function toggleMenu(){
        show = !show
        // console.log('toggling menu')
    }

    $: if ( path ) show = false



</script>


<nav class:desktop={$desktop} class:mobile={$mobile}>

    {#if !$desktop }
        <span class="menu-button" class:clicked={show} on:click|stopPropagation={toggleMenu}></span>
    {/if}

    {#if $desktop || show }
        <span class="menu-items" class:show={show}  transition:slide> 
            {#each menu as item}
                <a href={item.href} class:active={path==item.href} >
                    {item.label}
                </a>
            {/each}
        </span>
    {/if}

</nav>



<style>

    nav {
        display:flex;
        gap: 1rem;
        justify-content:flex-end;
        flex-direction:column;
        overflow:visible;
    }

    nav.desktop {
        flex-direction:row;
        flex-grow: 3;
    }

    a {
        text-decoration: none;
        text-transform: uppercase;

        color: var(--colour-menu);
        background-color: var(--colour-background);

        padding:0.6rem;
    }

    nav.mobile a {
        padding:1.2rem;
    }

    a:hover {
        background-color: var(--colour-menu-hover);
        /* color:white; */
    }

    a.active {
        background-color: var(--colour-menu-active);
        color:white;
        cursor: default;
    }   

    /* nav.mobile a {
        background-color: var(--colour-menu);
        color:white;
    }

    nav.mobile a:hover {
        background-color:var(--colour-menu-hover);
    }

    nav.mobile a.active {
        color: var(--colour-menu);
        background-color:var(--colour-background);
    } */

    .menu-button {
        border-top:6px solid var(--colour-menu);
        border-bottom:6px solid var(--colour-menu);
        width:32px;
        height:32px;
        transition: all ease-in-out 300ms;
    }

    .menu-button.clicked {
        transform: rotateZ(90deg);
    }

    .menu-button,
    .menu-button:before {
        display:block;
        position:relative;

    }
    .menu-button:before {
        content: '';
        top: 7px;
        border-bottom:6px solid var(--colour-menu);
    }

    .menu-button:hover,
    .menu-button:hover:before {
        /* border-color:var(--colour-menu-hover); */
        cursor: pointer;
    }

    .menu-items {
        display:flex;
        align-items: flex-end;
    }



    nav.mobile .menu-items {

        position:fixed;
        
        left:0;
        width:80%;

        flex-direction:column;
        justify-content: space-around;

        background-color: var(--colour-menu);
        z-index: 100;
        /* padding:1rem 0 1rem 0; */
        padding:0rem;

        box-shadow: gray 2px 1px 5px;

        top:-50ch;
    }

    nav.mobile .menu-items.show {
        top:0;
    }

    nav.mobile .menu-items a {
        width:100%;
    }


    nav.desktop .menu-items {
        position:static;
        top:0;
        justify-content:flex-end;
        column-gap: 0.5rem;
        flex-grow: 3;
    }

</style>



