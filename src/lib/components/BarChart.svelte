<script>
  	import { Chart, Utils } from "chart.js";
    import * as d3 from 'd3'
	import { onMount } from 'svelte';  

    //export let data;

    let ctx;
	let chartCanvas;
    let chart;

    onMount(() => {
        let isDragging = true;
        var options = {
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        };

        const labels = [1,2,3,4,5,6,7];
const data = {
  labels: labels,
  datasets: [{
    label: 'My First Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
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
		chart = new Chart(ctx, {
		    type: 'bar',
		    data: data,
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