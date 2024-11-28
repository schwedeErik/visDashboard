<script>
    //const { data } = $props()

    import { base } from '$app/paths';
    import { onMount } from 'svelte';
    import Scatterplot from '$lib/components/Scatterplot.svelte';
    import Barplot from '$lib/components/Barplot.svelte';
    import Heatmap from '$lib/components/Heatmap.svelte';

    import { scaleLinear, scaleLog, scaleSqrt, scaleOrdinal } from 'd3-scale';
    import { csv } from 'd3-fetch';
    import { extent } from 'd3-array';
    import * as d3 from 'd3';
    

    
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
  </script>

  <!-- <Scatterplot data={students}/> -->
  {#if students} 
  <Scatterplot data={students}/>  
  <Barplot data={students}/>
  <Heatmap/>
    
  {/if}
  