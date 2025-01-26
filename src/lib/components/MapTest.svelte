<script>
    import { onMount } from "svelte";
    import L from "leaflet";
    import 'leaflet/dist/leaflet.css'
    let map;

    onMount(() => {
        map = L.map("map").setView([65, 100], 2.8);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    });

    // Fix map size issues when rendered
    setTimeout(() => {
            map.invalidateSize();
        }, 200);
</script>

<div id="map"></div>

<style>
    #map{
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>