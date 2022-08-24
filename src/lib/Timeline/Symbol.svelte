<script>

    // https://bennettfeely.com/clippy/

    export let i
    export let index
    export let defaultColour
    export let symbolIndex
    export let symbols
    export let selectedPoint

    // $: console.log('selectedPoint',selectedPoint)

    const symbolSize = 8

    let active = false
    let colour = ''
    let sIndex = symbolIndex

    $: sIndex = selectedPoint.index==index && selectedPoint.i == i ? 'selected' : symbolIndex

    $: active = selectedPoint && selectedPoint.index==index

    $: {
        colour = 'transparent'
        if ( symbols ) {
            if ( selectedPoint == false || active ){
                colour = defaultColour
            }
        } else if ( selectedPoint.index==index && selectedPoint.i == i ){
            colour = defaultColour
        }
    }

</script>


<!------------------------------------------------------------------------------
@section HTML
-------------------------------------------------------------------------------->


<rect class="symbol-{sIndex}" style:fill={colour}
      x={-symbolSize/2} y={-symbolSize/2} width={symbolSize} height={symbolSize} />



<!------------------------------------------------------------------------------
@section STYLES
-------------------------------------------------------------------------------->



<style>

rect {
    cursor:pointer;
}
rect:hover {
    outline: 10px solid var(--colour-highlight);
}

.symbol-selected {
    clip-path: circle(50% at 0 0);
}
.symbol-0 {
    clip-path: polygon(10% 10%, 90% 10%, 90% 90%, 10% 90%); /* Smaller square */
}
.symbol-1 {
    clip-path: circle(50% at 0 0);
}
.symbol-2 {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%); /* Diamond */
}
.symbol-3 {
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%); /* Up arrow */
}
.symbol-4 {
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%); /* Down arrow */
}
.symbol-5 {
    clip-path: polygon(0% 0%, 100% 50%, 0% 100%); /* Right arrow */
}
.symbol-6 {
    clip-path: polygon(0% 50%, 100% 0%, 100% 100%); /* Left arrow */
}




</style>