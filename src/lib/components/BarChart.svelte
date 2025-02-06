<script>
  	import { Chart, Utils } from "chart.js";
    import * as d3 from 'd3'
	import { onMount } from 'svelte';  

    export let data;
    export let region = 'Russian Federation';
    export let year = 2008;

    let ctx;
	let chartCanvas;
    let chart;

    function filterData(d, year, region){
        return d.filter(cD => cD["region"] === region && parseInt(cD["year"]) === year);
    }

    function mapValue(d,value,type){
        const crimeTypes = Object.keys(d)
        const outputData = []
        crimeTypes.forEach(cT => {
            if(cT == type)
                outputData.push(value)
            else
                outputData.push(undefined)
        })

        return outputData;
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
        const filteredData = filterData(data,year,region);
        const sortedData = sortDataByMostCommonCrime(filteredData)
        const groupedData = groupData(sortedData);
        

        const crimeTypes = Object.keys(groupedData).map(type => shortenCrimeType(type));
        
        // Create the data objects
        const crimeDataObjects = Object.keys(groupedData).map(crimeType => {

            return {
                label: shortenCrimeType(crimeType),
                data: mapValue(groupedData, groupedData[crimeType].at(0).value,crimeType),
                fill: false,
                borderColor: mapColor(crimeType), // Adjust color as needed
                borderWidth: 1.5,
                backgroundColor: mapColor(crimeType),
            };

        });

        console.log(crimeTypes)
        console.log(crimeDataObjects)

        const chartData = {
            labels: crimeTypes,
            datasets: crimeDataObjects }

        return chartData
    }

    function genCData(){
        const filteredData = filterData(data,2008,region);
        const sortedData = sortDataByMostCommonCrime(filteredData);
        console.log(sortedData)

        const dataset = {

        }

    }

    $: if(region && chart && year){
        chart.data = generateChartData();
        chart.update();
    }

    onMount(() => {
        var options = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                xAxes:[
                    {
                        stacked: true,
                    }
                ],
            },
            title: {
                display: true,  // Enables the title
                text: 'Crime Statistics Overview',  // Your chart title
                fontSize: 16,  // Adjust size
                fontColor: '#333',  // Title color
                fontStyle: 'bold',
                padding: 10,  // Spacing around title
        }
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

        genCData();
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