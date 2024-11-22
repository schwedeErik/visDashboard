<script>
    export let data;
    export let xScale;
    export let yScale;
    export let height;
    export let colorScale;
    export let margin;
    export let barWitdh
    export let hoverData
</script>

<g>

    {#each data as d}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
        <rect 
            width={hoverData && hoverData == d ? barWitdh*1.2 : barWitdh} 
            height={yScale(d.score)} 
            y ={height - yScale(d.score) - margin.bottom - margin.top} 
            x = {xScale(d.group)-barWitdh/2.0*(hoverData && hoverData == d ? 1.2 : 1)} 
            fill={colorScale(d.group)}
            opacity={hoverData == d || !hoverData ? "1" : ".3"}
            on:mouseover={()=> hoverData = d}/>
    {/each}
</g>

<style>
    rect {
      transition: all 300ms ease;
      cursor: pointer;
    }

  </style>

