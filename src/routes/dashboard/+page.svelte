<script>
    import Map from '$lib/components/Map.svelte';
    import MapTest from '$lib/components/MapTest.svelte';
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>
<!-- 
    <dic class="main-header">
        <h2>Crimes in Russia 2008-2023</h2>
    </dic> -->
    <Map/>



<style>
    .main-header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 10px 0; /* Add some spacing */
        color: #333; /* Neutral text color */
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
        font-size: 20px; /* Slightly smaller and minimalistic */
    }

    h2 {
        margin: 0;
        padding: 0;
        letter-spacing: 1px; /* Subtle spacing for better readability */
        text-transform: uppercase; /* Consistent with dashboard typography */
    }

</style>