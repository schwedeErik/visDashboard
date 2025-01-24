<script>
    import * as d3 from "d3";
  
    // Configuration for the legend
    export let width = 300; // Width of the legend
    export let height = 20; // Height of the gradient bar
    export let domain = [1500, 0]; // Domain of the color scale
  
    // Create a sequential color scale
    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateRdYlBu)
      .domain(domain);
  
    // Generate gradient stops
    const numStops = 10; // Number of stops in the gradient
    const stops = Array.from({ length: numStops }, (_, i) => i / (numStops - 1)); // 0 to 1
  </script>
  
  <svg
    class="legend"
    width="{width}"
    height="{height + 30}"
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
      x="0"
      y="0"
      width="{width}"
      height="{height}"
      fill="url(#legend-gradient)"
    />
  
    <!-- Axis -->
    <g transform="translate(0, {height})">
      <line x1="0" y1="0" x2="{width}" y2="0" stroke="#000" />
      {#each domain as value, i}
        <text
          x="{i === 0 ? 0 : width}"
          y="15"
          text-anchor="{i === 0 ? 'start' : 'end'}"
          font-size="10"
          fill="#000"
        >
          {value}
        </text>
      {/each}
    </g>
  </svg>