<script>
    import Map from '$lib/components/Map.svelte';
    import MapTest from '$lib/components/MapTest.svelte';
</script>
<div>
    <!-- <dic class="main-header">
        <h1 >Crime Dashboard</h1>
    </dic> -->
    <Map/>
</div>


<style>
    .main-header{
        display: flex;
        justify-content: center;
    }

    h1{
        font-family: 'Courier New', Courier, monospace;
    }

    body{
        display: flex;
        flex-direction: column;
        height: 100vh
    }
</style>