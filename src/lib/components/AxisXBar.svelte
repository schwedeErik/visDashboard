<script>
    export let height;
    export let xScale;
    export let margin;
    export let xTicks;
    export let barWitdh;
  </script>
  
  <g>
    {#each xTicks as tick}
      <text
        x={xScale(tick) - barWitdh/2}
        y={height - margin.bottom}
        dominant-baseline="hanging">{tick}</text
      >
    {/each}
  </g>