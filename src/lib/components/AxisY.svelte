<script>
    export let height;
    export let width;
    export let yScale;
    export let margin;
    let yTicks = [0, 25, 50, 75, 100];
    import { max, min } from "d3-array";
  </script>
  
  <g transform="translate({margin.left} {margin.top})">
    {#each yTicks as tick}
      <text x={0} y={yScale(tick)} dy="-6"
        >{tick}% {tick == max(yTicks) ? " writing score" : ""}</text
      >
      <line
        x1="0"
        y1={yScale(tick)}
        x2={width}
        y2={yScale(tick)}
        stroke={tick == min(yTicks) ? "black" : "#cecece"}
      />
    {/each}
  </g>
  