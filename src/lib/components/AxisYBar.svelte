<script>
    export let height;
    export let width;
    export let yScale;
    export let margin;
    let yTicks = [0, 25, 50, 75, 100];
    import { max, min } from "d3-array";
  </script>
  
  <g>
    {#each yTicks as tick}
      <text x={margin.right} y={yScale(tick)} dy="-6"
        >{tick}% {tick == yTicks[yTicks.length - 1] ? " Average Math Score" : ""}</text
      >
      <line
        x1={margin.right}
        y1={yScale(tick)}
        x2={width}
        y2={yScale(tick)}
        stroke={tick == min(yTicks) ? "black" : "#cecece"}
      />
    {/each}
  </g>
  