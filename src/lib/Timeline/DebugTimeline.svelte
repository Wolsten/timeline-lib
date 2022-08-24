<script>
    export let data
    export let options
</script>


<h3>Embedded Timeline: {data.name} <span class="smaller">({options.xRange.start} to {options.xRange.end})</span></h3>

<h4>Data</h4>

<dl>
    <dt>min</dt><dd>{data.min}</dd>
    <dt>max</dt><dd>{data.max}</dd>
    <dt>start</dt><dd>{data.start}</dd>
    <dt>end</dt><dd>{data.end}</dd>
    <dt>categories</dt><dd>{data.categories.join(', ')}</dd>
    <dt>subCats</dt><dd>{data.subCats.join(', ')}</dd>
    <dt>xAxis</dt><dd>{data.xAxis.majorFirst}, {data.xAxis.majorLast}, {data.xAxis.majorRange}, {data.xAxis.xUnit}</dd>
</dl>

<h4>Events</h4>

{#if data.events.length == 0 }
    <p>None</p>
{/if}

{#each data.events as event}
    <p>{event.id}. {event.name} <span class="smaller">({event.start} to {event.end})</span></p>
{/each}

<h4>Series</h4>

{#if data.series.length == 0 }
    <p>None</p>
{/if}

{#each data.series as series}
    <h5>{series.id}. {series.name}: C={series.categories.join(', ')}, SC={series.subCategory}, SI={series.symbolIndex}, CI={series.colourIndex}, xUnit={series.xUnit} <span class="smaller">({series.min}-{series.max})</span></h5>
    <p>
        {#each series.points as p} 
            ({p.x},{p.value}),&nbsp;
        {/each}
    </p>
{/each}

<h3>Options</h3>

<dl>
    <dt>filter</dt><dd>{options.search || 'none'}</dd>
    <dt>readonly</dt><dd>{options.readonly}</dd>
    <dt>subCats</dt><dd>{options.subCats.join(', ')}</dd>
    <dt>sort</dt><dd>{options.sort}</dd>
    <dt>symbols</dt><dd>{options.symbols}</dd>
    <dt>title</dt><dd>{options.title || 'none'}</dd>
    <dt>categorise</dt><dd>{options.categorise}</dd>
    <dt>totalise</dt><dd>{options.totalise}</dd>
    <dt>xRange</dt><dd>{options.xRange.start}, {options.xRange.end}, {options.xRange.range}</dd>
</dl>


<style>
    .smaller {
        font-size: smaller;
        color: chocolate;
    }
</style>