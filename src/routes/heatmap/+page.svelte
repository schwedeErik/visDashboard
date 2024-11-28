<script>
    import { onMount } from "svelte";
    import * as d3 from "d3";
    import { base } from '$app/paths';
  
    let width = 600;
    let height = 600;
  
    // Heatmap dimensions
    let margin = { top: 20, right: 20, bottom: 40, left: 50 };
    let innerWidth = width - margin.left - margin.right;
    let innerHeight = height - margin.top - margin.bottom;
  
    onMount(async () => {
      // Load and process the CSV data
      const data = await d3.csv( base + "/data/ev_charging_patterns.csv", (d) => ({
        startCharge: Math.round(+d["State of Charge (Start %)"]),
        endCharge: Math.round(+d["State of Charge (End %)"])
      }));
  
      // Aggregate data for frequency
      const frequencyData = d3.rollups(
        data,
        (v) => v.length,
        (d) => d.startCharge,
        (d) => d.endCharge
      ).flatMap(([start, values]) =>
        values.map(([end, freq]) => ({
          startCharge: start,
          endCharge: end,
          frequency: freq
        }))
      );
  
      drawHeatmap(frequencyData);
    });
  
    function drawHeatmap(data) {
      const svg = d3
        .select("#heatmap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
      // Scales
      const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.startCharge))
        .range([margin.left, innerWidth]);
  
      const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.endCharge))
        .range([innerHeight, margin.top]);
  
      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, d3.max(data, (d) => d.frequency)]);
  
      // Axes
      svg
        .append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d")))
        .attr("font-size", "12px");
  
      svg
        .append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale).ticks(10).tickFormat(d3.format("d")))
        .attr("font-size", "12px");
  
      // Rectangles
      svg
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (d) => xScale(d.startCharge))
        .attr("y", (d) => yScale(d.endCharge))
        .attr("width", (innerWidth - margin.left) / 20)
        .attr("height", (innerHeight - margin.top) / 20)
        .attr("fill", (d) => colorScale(d.frequency))
        .attr("stroke", "white");
  
      // Labels
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .text("State of Charge (Start %)");
  
      svg
        .append("text")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("transform", "rotate(-90)")
        .text("State of Charge (End %)");
    }
  </script>
  
  <div id="heatmap"></div>
  
  <style>
    #heatmap {
      font-family: Arial, sans-serif;
    }
  </style>