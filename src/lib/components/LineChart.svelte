<script>
	import { Chart, Utils } from "chart.js";
    import * as d3 from 'd3'
	import { onMount } from 'svelte';

    export let data;
    export let startYear = 2008;
    export let categories;

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

        if(!categories.includes(crimeType))
            return;
        const year = +row.year;
        const value = +row.number_of_crimes_per_onehundretthousend;

        if (!groupedData[crimeType]) {
            groupedData[crimeType] = [];
        }
        groupedData[crimeType].push({ year, value });
        });

        return groupedData;
    }

    function shortenCrimeType(crimeType){
        const crimeTypes = {
        "Theft": "Theft",       // Vivid Green
        "Crimes in the Sphere of Economic Activity": "Economic Crime",    // Turquoise
        "Robbery without violence": "Robbery (No Violence)",     // Soft Purple
        "Murder": "Murder",   // Bright Yellow
        "Rape": "Rape",       // Vibrant Orange
        "Robbery with violence": "Robbery (Violence)",// Emerald Green
        "Extortion": "Extortion",    // Warm Brown
        "Hooliganism": "Hooliganism", // Hot Pink
        "Intentional Bodily Harm": "Bodily Harm"        // Muted Olive Green
        };
        // Return the corresponding color, or a default gray if the type is unknown
        return crimeTypes[crimeType] || crimeType; // Default: Light Gray
    }
    
    function mapColor(crimeType){
        const colors = {
        "Theft": "#2ECC71",       // Vivid Green
        "Crimes in the Sphere of Economic Activity": "#1ABC9C",    // Turquoise
        "Robbery without violence": "#9B59B6",     // Soft Purple
        "Murder": "#F1C40F",   // Bright Yellow
        "Rape": "#E67E22",       // Vibrant Orange
        "Robbery with violence": "#27AE60",// Emerald Green
        "Extortion": "#8D6E63",    // Warm Brown
        "Hooliganism": "#FF69B4", // Hot Pink
        "Intentional Bodily Harm": "#A3CB38"        // Muted Olive Green
    };
    // Return the corresponding color, or a default gray if the type is unknown
    return colors[crimeType] || "#95A5A6"; // Default: Light Gray
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
                label: shortenCrimeType(crimeType),
                data: sortedData.map(item => item.value),
                fill: false,
                borderColor: mapColor(crimeType), // Adjust color as needed
                borderWidth: 1.5,
                backgroundColor: mapColor(crimeType),
                pointRadius: 0,
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
                    d: {
                        display: false,
                    },
                    beginAtZero: false,
                    type: 'linear', // Use 'linear' for numerical data or 'category' for labels
                },
                y: {
                    beginAtZero: true,
                    type: 'linear',
                    
                },
            },
            plugins: {
                legend: {
                    display: true,
                },
            },
            layout: {
                padding:{
                    left:0,
                    right:0,
                }
            },
            legend: {
                onClick: (e) => e.preventDefault(), // Disable legend clicks
            }
        };

        ctx = chartCanvas.getContext('2d');
		chart = new Chart(ctx, {
		    type: 'line',
		    data: generateChartData(),
            options: options,
            plugins: [verticalLinePlugin],
		});

        chart.options.scales.y.afterFit = function(axis) {axis.width = 150;};
        chart.update();


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
    //chart.update();
});

chartCanvas.addEventListener('mouseup', () => {
    isDragging = false;
});


	});

$: if(chart && startYear){
    chart.update()
}
    
    

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