<script>
    //const { data } = $props()

    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import { scaleLinear, scaleLog, scaleSqrt, scaleOrdinal } from 'd3-scale';
    import { csv } from 'd3-fetch';
    import { extent } from 'd3-array';
    import * as d3 from 'd3';
    import Axis from '$lib/components/Axis.svelte';
    import Labels from '$lib/components/Labels.svelte';
    import RadialLegend from '$lib/components/RadialLegend.svelte';
    import CategoryLegend from '$lib/components/CategoryLegend.svelte';

    
    let students 


    // onMount(async () => {
    //     const response = await fetch(base + '/data/StudentsPerformance.csv', { headers: { 'Content-Type': 'text/csv' }})
    //     let csvStudents = await response.text()
    //     let parsedCsvStudents = Papa.parse(csvStudents, {header: true})
    //     students = parsedCsvStudents.data
    //     console.log(students)
    // });
    
    onMount(() =>{
        csv(base + '/data/StudentsPerformance.csv')
        .then((unsorted_data) => unsorted_data.sort((a,b) => b.math_score - a.math_score))
        .then((sorted_data) => (students = sorted_data))
    });

    const scaleY = scaleLinear().domain([0,100]).range([20,1000])
    const scaleColor = scaleLinear().domain([0, 25, 50, 75 , 100]).range(["gray", "red", "green", "blue", "orange"]) 
    const scaleRadius = scaleLinear().domain([0,100]).range([2,5]) 
    
    let width = 640;
    const height = 400;
    const margin = {top: 40, right:20, bottom: 20, left: 35}

    let xScale, yScale, radiusScale;
    
    $: if (students) {
      xScale = scaleLinear()
        .domain(extent(students, (s) => +s.math_score))
        .range([margin.left, width - margin.right]);
      
      yScale = scaleLinear()
        .domain(extent(students, (s) => +s.writing_score))
        .range([height - margin.bottom, margin.top]);

      radiusScale = scaleSqrt()
        .domain(extent(students, (s) => +s.reading_score))
        .range([2,5])  
    }

    const colors = scaleOrdinal()
      .range([
        '#e0dff7',
        '#EFB605',
        '#FFF84A',
        '#FF0266',
        '#45FFC8'
    ])
      .domain([
        'group A',
        'group B',
        'group C',
        'group D',
        'group E'
    ]);

    const ethnicGroups =[
        'group A',
        'group B',
        'group C',
        'group D',
        'group E'
    ];


    const x = d3.scaleLinear()
                .domain(extent(students, (s) => +s.math_score))
                .range([margin.left, width - margin.right]);

  // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
                .domain(extent(students, (s) => +s.writing_score))
                .range([height - margin.bottom, margin.top]);

    const svg = d3.create('svg')
                  .attr('width', width)
                  .attr('height', height);

    svg.append('g')
       .attr('transform', `translate(0,${height - margin.bottom})`)
       .call(d3.axisBottom(x));

    svg.append("g")
       .attr("transform", `translate(${margin.left},0)`)
       .call(d3.axisLeft(y));

    contain

      
  </script>
  
  <!-- <svg width="1020" height="1020">
    {#each students as student}
        <circle cx={scaleY(student.math_score)}
                cy={scaleY(student.reading_score)}
                r={scaleRadius(student.writing_score)}
                style={"fill:" + scaleColor(student.math_score)} />
    {/each}
  </svg> -->

<div id='container'></div>
  
<!-- <div
  class="flex max-w-3xl flex-col items-center lg:flex-row"
  bind:clientWidth={width}>
  <div class="relative">
    {#if students && width}
      <svg {width} {height}>
        <g>
          <Labels
            labelforx={true}
            {width}
            {height}
            {margin}
            yoffset={-30}
            xoffset={-170}
            label={'Math Score'} />
          <Labels
            labelfory={true}
            textanchor={'start'}
            {width}
            {height}
            {margin}
            yoffset={10}
            xoffset={10}
            label={'writing Score'} />
          {#each students as d, i}
          <circle
            class={d.race_ethnicity.split(' ').join('')}
            cx={xScale(+d.math_score)}
            cy={yScale(+d.writing_score)}
            r={radiusScale(+d.reading_score)}
            fill={colors(d.race_ethnicity)}/>
          {/each}
        </g>
      </svg>
    {/if}
  </div>
</div> -->