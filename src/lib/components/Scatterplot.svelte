<script>

    export let data;
    import { scaleLinear } from "d3-scale";
    import { max } from "d3-array";
  
    let width = 1500;
    let height = 500;
  
    const margin = { top: 20, right: 40, left: 20, bottom: 20 };
  
    $: xScale = scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.left - margin.right]);
    $: yScale = scaleLinear()
      .domain([0, 100])
      .range([height - margin.top - margin.bottom, margin.top]);
  
    import AxisX from "$lib/components/AxisX.svelte";
    import AxisY from "$lib/components/AxisY.svelte";
    import Tooltip from "$lib/components/Tooltip.svelte";
  
    let hoverData;
    $: console.log(hoverData);
  </script>
  
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="chart-container"
    bind:clientWidth={width}
    on:mouseleave={() => {
      hoverData = null;
    }}
  >
    <svg {width} {height}>
      <AxisX {height} {xScale} {margin} />
      <AxisY {yScale} {height} {width} {margin} />
      {#if data}
      {#each data.sort((a, b) => a.math_score - b.math_score) as student}
        <circle
          cx={xScale(student.math_score)}
          cy={yScale(student.writing_score)}
          r={hoverData && hoverData == student ? "10" : "3"}
          fill="purple"
          stroke="black"
          opacity={hoverData == student || !hoverData ? "1" : ".3"}
          on:mouseover={() => {
            hoverData = student;
          }}
          on:focus={() => {
            hoverData = student;
          }}
          tabIndex="0"
        />
      {/each}
      {/if}
    </svg>
    {#if hoverData}
      <Tooltip data={hoverData} {xScale} {yScale} />
    {/if}
  </div>
  
  <style>
    circle {
      transition: all 100ms ease;
      cursor: pointer;
    }

    circle:focus {
      outline: none;
    }
  </style>