<script>
    import { onMount } from "svelte";
    import L from "leaflet";
    let map;

    onMount(async () => {
      map = L.map("map", { preferCanvas: true }).setView(
        [50.8476, 4.3572],
        2,
      );
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
          maxZoom: 18,
        },
      ).addTo(map);
    });
</script>
<svelte:head>
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
      crossorigin=""
    />
  
    <script
      src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
      crossorigin=""
    >
    </script>
  </svelte:head>
<div id="map"></div>

<style>
    #map {
        height: 480px;
    }
  </style>