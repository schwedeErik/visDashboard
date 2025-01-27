<script>
  	import { Chart, Utils } from "chart.js";
    import * as d3 from 'd3'
	import { onMount } from 'svelte';  

    export let data;
    export let region = 'Russian Federation';

    let ctx;
	let chartCanvas;
    let chart;

    function filterData(d, year, region){
        return d.filter(cD => cD["region"] === region && parseInt(cD["year"]) === year);
    }

    function sortDataByMostCommonCrime(d){
        d.sort((a, b) => {
            let crimesA = parseFloat(a["number_of_crimes_per_onehundretthousend"]);
            let crimesB = parseFloat(b["number_of_crimes_per_onehundretthousend"]);
            return crimesB - crimesA; // Descending order
        });
        return d;
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
        console.log(data)
        const filteredData = filterData(data,2008,region);
        const sortedData = sortDataByMostCommonCrime(filteredData)
        const groupedData = groupData(sortedData);
        
        console.log(filteredData)
        console.log(sortedData)

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
                borderWidth: 1.5,
                backgroundColor: colorScale(crimeType),
            };

        });

        console.log(crimeTypes)

        const chartData = {
            //labels: crimeTypes,
            datasets: crimeDataObjects }

        return chartData
    }

    onMount(() => {
        var options = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

    const data = {
        datasets: [{
            label: 'My First Dataset',
            data: [, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };
        
        ctx = chartCanvas.getContext('2d');
        const chartData = generateChartData();
        console.log(chartData)
		chart = new Chart(ctx, {
		    type: 'bar',
		    data: chartData,
            options: options,
		});

        chart.options.scales.y.afterFit = function(axis) {axis.width = 150;};
        chart.update();
    });

</script>

<div class="chart-container">
    <canvas bind:this={chartCanvas} id="myChart"></canvas>
</div>
    
<style>
    .chart-container {
        flex: 1;
        /* border: 5px solid black; */
        overflow: hidden;
}
</style>