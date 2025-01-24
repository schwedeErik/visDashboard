<script>
	import { Chart, Utils } from "chart.js";
    import * as d3 from 'd3'
	import { onMount } from 'svelte';

    export let data;
    export let startYear = 2008;

	let ctx;
	let chartCanvas;
    let chart;

	function filterData(d){
        if (!d) return [];
        const filteredData = d.filter(row => {
            const year = +row.year;
            if (row.region === 'Russian Federation') {
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
                backgroundColor: colorScale(crimeType),
                tension: 0.1
            };

        });

        const yearsList = [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023]

        const chartData = {
            labels: yearsList,
            datasets: crimeDataObjects }

        return chartData
    }
    
    // Plugin to draw a vertical line
    const verticalLinePlugin = {
    id: 'verticalLinePlugin',
    beforeDraw: (chart) => {
        const { ctx, chartArea, scales } = chart;
        console.log(scales["x-axis-0"].getPixelForValue(startYear))

        const xCoord = scales["x-axis-0"].getPixelForValue(startYear);
        const { top, bottom } = chartArea;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(xCoord, top);
        ctx.lineTo(xCoord, bottom);
        ctx.lineWidth = 5; // Line thickness
        ctx.strokeStyle = 'red'; // Line color
        ctx.stroke();
        ctx.restore();
    },
};


    onMount(() => {
        let isDragging = true;
        var options = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                x: {
                    beginAtZero: false,
                    type: 'linear', // Use 'linear' for numerical data or 'category' for labels
                },
                y: {
                    beginAtZero: true,
                    type: 'linear'
                },
            },
            plugins: {
                legend: {
                    display: true,
                },
            },
        };

        ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
		    type: 'line',
		    data: generateChartData(),
            options: options,
            plugins: [verticalLinePlugin],
		});


        chartCanvas.addEventListener('mousedown', (event) => {
    const rect = chartCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    // Calculate the current line's pixel position
    const xCoord = chart.scales["x-axis-0"].getPixelForValue(startYear);

    // Check if the click is close to the line
    if (Math.abs(mouseX - xCoord) < 5) {
        isDragging = true;
    }
});

chartCanvas.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const rect = chartCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    // Convert pixel position to x-axis value
    const newValue = chart.scales["x-axis-0"].getValueForPixel(mouseX);

    // Update the line's position and redraw
    startYear = newValue + 2008;
    chart.update();
});

chartCanvas.addEventListener('mouseup', () => {
    isDragging = false;
});


	});


    

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