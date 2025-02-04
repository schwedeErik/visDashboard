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

    
    
    
    
    function generateChartData(){
        const filteredData = filterData(data,year,region);
        const sortedData = sortDataByMostCommonCrime(filteredData)
        const groupedData = groupData(sortedData);
        

        const crimeTypes = Object.keys(groupedData);
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(crimeTypes);
        
        // Create the data objects
        const crimeDataObjects = Object.keys(groupedData).map(crimeType => {

            return {
                label: crimeType,
                data: mapValue(groupedData, groupedData[crimeType].at(0).value,crimeType),
                fill: false,
                borderColor: colorScale(crimeType), // Adjust color as needed
                borderWidth: 1.5,
                backgroundColor: colorScale(crimeType),
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