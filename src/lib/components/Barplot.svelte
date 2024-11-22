<script>

    export let data;
    import { scaleLinear, scaleBand, scaleOrdinal } from "d3-scale";
    import { max } from "d3-array";
    import Bars from "./Bars.svelte";
    import AxisXBar from "./AxisXBar.svelte";
    import AxisYBar from "./AxisYBar.svelte";
    import ToolTipBar from "./ToolTipBar.svelte";
    let width = 1500;
    let height = 500;
    let hoverData;
    const margin = { top: 20, right: 40, left: 40, bottom: 20 };
    const barmargin = { top: 20, right: 40, left: 40, bottom: 20 };

    const classes = [... new Set(data.map(d => d.race_ethnicity))].sort((a, b) => a.localeCompare(b));
    const classCount = classes.length;
    $: barWitdh = ((width - margin.right - margin.left)/classCount) * 0.5;
    
    const colorScale = scaleOrdinal()
        .domain(classes)
        .range(['#003f5c', '#58508d', '#bc5090', '#ff6361', '#ffa600']);
    $: xScale = scaleBand()
        .domain(classes)
        .range([barWitdh/2.0 + margin.left + barmargin.left, width - margin.right - barmargin.right]);
    const yScale = scaleLinear()
      .domain([0, 100])
      .range([height - margin.top - margin.bottom, margin.top]);
    
    const grouped = data.reduce((acc, item) => {
        const score = parseInt(item.math_score);
    if (!acc[item.race_ethnicity]) {
        acc[item.race_ethnicity] = { totalScore: 0, count: 0 };
    }
    acc[item.race_ethnicity].totalScore += score;
    acc[item.race_ethnicity].count += 1;
    return acc;
}, {});

// Step 2: Calculate averages and create the result list
const averages = Object.entries(grouped).map(([group, { totalScore, count }]) => ({
    group,
    score: totalScore / count
})).sort((a,b) => a.group.localeCompare(b.group));
  </script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
class="chart-container"
bind:clientWidth={width}
on:mouseleave={() => {
    hoverData = null;
  }}>
<svg {width} {height}>
    <AxisXBar {xScale} {margin} xTicks={classes} {height} {barWitdh}/>
    <AxisYBar {height} width={xScale(classes[4]) + barWitdh + margin.right} {margin} {yScale}/>
    <Bars {barWitdh} {xScale} {yScale}  data={averages} {height} {colorScale} {margin} {hoverData}/>

</svg>

{#if hoverData}
      <ToolTipBar data={hoverData} {xScale} {yScale} />
    {/if}
</div>

  