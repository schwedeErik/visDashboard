<script>
    import Map from '$lib/components/Map.svelte';
    import SliderTest from '$lib/components/SliderTest.svelte';
    import LineChart from '$lib/components/LineChart.svelte';
</script>
<dic class="main-header">
    <h1 >Crime Dashboard</h1>
</dic>

<Map></Map>
<style>
    .main-header{
        display: flex;
        justify-content: center;
    }

    h1{
        font-family: 'Courier New', Courier, monospace;
    }
</style>