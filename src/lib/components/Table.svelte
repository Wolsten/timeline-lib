<script>

    export let data
    export let caption

</script>

<figure>
    
    <table>
        {#each data.rows as row, index}
            <tr>
                {#each row as col,ci}
                    {@const align = data.colTextAligns[ci] ? data.colTextAligns[ci]: ''  }
                    {#if data.rowFormats[index] && data.rowFormats[index] == 'th'}
                        <th class={align}>{col}</th>
                    {:else}
                        <td class={align}>{col}</td>
                    {/if}
                {/each}
            </tr>
        {/each}
    </table>

    {#if caption}
        <figCaption>{caption}</figCaption>
    {/if}
</figure>



<style>

    figure {
        display:flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        margin: 3rem 0;
    }

    th,
    td {
        padding: 0.5rem 1rem;
    }

    th.right,
    td.right {
        text-align: right;
    }


</style>