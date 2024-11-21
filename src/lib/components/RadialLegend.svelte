<script>
    export let width, height, radiusScale;
    export let radialLegendData = [30000000, 300000000, 1000000000];
  
    function format_number(d) {
      if (d < 1000000000) {
        const div = +d / +1000000 + 'M';
        return div;
      } else {
        const div = +d / +1000000000 + 'B';
        return div;
      }
    }
  </script>
  
  <g fill="red" transform="translate(62,100)">
    <text class="fill-gray-200 text-lg" x="0" y="-42" text-anchor="middle"
      >Population</text>
    {#each radialLegendData as d}
      <circle
        class="radial-legend-circle fill-transparent stroke-gray-100"
        cx=""
        cy={10 - radiusScale(d)}
        r={radiusScale(d)} />
  
      <text class="fill-gray-200 text-xs" x="40" y={13 - 2 * radiusScale(d)}
        >{format_number(d)}</text>
  
      <line
        class=" stroke-gray-300 stroke-1"
        x1="0"
        x2="35"
        y1={10 - 2 * radiusScale(d)}
        y2={10 - 2 * radiusScale(d)} />
    {/each}
  </g>
  
  <style>
    .radial-legend-circle {
      stroke-dasharray: 2 2;
      box-sizing: border-box;
    }
  </style>