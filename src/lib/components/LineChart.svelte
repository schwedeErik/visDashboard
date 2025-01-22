<script>
	import { Chart, Utils } from "chart.js";
    import * as d3 from 'd3'
	import { onMount } from 'svelte';

    export let data;
    export let startYear = 2008;
    export let endYear = 2023;

	let ctx;
	let chartCanvas;
    let chart;

    let yearSet = new Set();

	function filterData(d){
        if (!d) return [];
        const filteredData = d.filter(row => {
            const year = +row.year;
            if (row.region === 'Russian Federation' && year >= startYear && year <= endYear) {
                yearSet.add(year); // Add the year to the Set
                return true;
            }
            return false;
        });

        return filteredData;
    }

    function groupData(d){
        const groupedData = {};
        d.forEach(row => {
        const crimeType = row.type_of_crime;
        const year = +row.year;
        const value = +row.number_of_crimes_per_onehundretthousend;

        if (!groupedData[crimeType]) {
            groupedData[crimeType] = [];
        }
        groupedData[crimeType].push({ year, value });
        });

        return groupedData;
    }
    
    
    
    function generateChartData(){
        yearSet = new Set();
        const filteredData = filterData(data);
        const groupedData = groupData(filteredData)

        const crimeTypes = Object.keys(groupedData);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(crimeTypes);
        
        // Create the data objects
        const crimeDataObjects = Object.keys(groupedData).map(crimeType => {
            // Sort the data by year
            const sortedData = groupedData[crimeType].sort((a, b) => a.year - b.year);

            return {
                label: crimeType,
                data: sortedData.map(item => item.value),
                fill: false,
                borderColor: colorScale(crimeType), // Adjust color as needed
                tension: 0.1
            };

        });

        const yearsList = Array.from(yearSet).sort((a,b)=> a -b);

        const chartData = {
            labels: yearsList,
            datasets: crimeDataObjects }

        return chartData
    }
    
    
    onMount(() => {

        var options = {
            maintainAspectRatio: false,
            };

        ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
		    type: 'line',
		    data: generateChartData(),
            options: options
		});


	});

    $: if(startYear || endYear){
        console.log(startYear)
        
        
        if(chart){
            chart.data = generateChartData()
            chart.update()
            
        }
            
    }


    

</script>
<div class="chart-container">
    <canvas bind:this={chartCanvas} id="myChart"></canvas>
</div>
    
<style>
    .chart-container {
        position: relative;
        margin: auto;
        height: 50vh;
        width: 80vw;
}
</style>