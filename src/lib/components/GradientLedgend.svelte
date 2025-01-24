<script>
  import * as d3 from "d3";

  // Configuration for the legend
  export let width = 300; // Width of the legend
  export let height = 20; // Height of the gradient bar
  export let domain = [1500, 0]; // Domain of the color scale

  // Padding for the legend
  const padding = 20; // Space on the left and right for labels

  // Create a sequential color scale
  const colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateRdYlBu)
    .domain(domain);

  // Generate gradient stops
  const numStops = 10; // Number of stops in the gradient
  const stops = Array.from({ length: numStops }, (_, i) => i / (numStops - 1)); // 0 to 1

  // Generate tick positions
  const numTicks = 5; // Number of ticks including min and max
  const tickValues = d3.range(domain[0], domain[1], (domain[1] - domain[0]) / (numTicks - 1)).concat(domain[1]);
  const tickScale = d3.scaleLinear().domain(domain).range([padding, width - padding]);
</script>

<svg
  class="legend"
  width="{width + 2 * padding}"
  height="{height + 40}" 
  style="display: block; margin: 20px;"
>
  <!-- Gradient Definition -->
  <defs>
    <linearGradient id="legend-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
      {#each stops as stop}
        <stop
          offset="{stop * 100}%"
          stop-color="{colorScale(stop * (domain[1] - domain[0]) + domain[0])}"
        />
      {/each}
    </linearGradient>
  </defs>

  <!-- Gradient Rectangle -->
  <rect
    x="{padding}"
    y="0"
    width="{width - 2 * padding}"
    height="{height}"
    fill="url(#legend-gradient)"
  />

  <!-- Axis -->
  <g transform="translate(0, {height + 10})">
    <!-- Axis Line -->
    <line x1="{padding}" y1="0" x2="{width - padding}" y2="0" stroke="#000" />

    <!-- Ticks and Labels -->
    {#each tickValues as value}
      <g transform="translate({tickScale(value)}, 0)">
        <!-- Tick Line -->
        <line y1="0" y2="5" stroke="#000" />
        <!-- Tick Label -->
        <text
          y="15"
          text-anchor="{value === domain[0] ? 'start' : value === domain[1] ? 'end' : 'middle'}"
          font-size="10"
          fill="#000"
        >
          {Math.round(value)}
        </text>
      </g>
    {/each}
  </g>
</svg>