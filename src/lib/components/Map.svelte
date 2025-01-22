<script>
    import { onMount } from "svelte";
    import { csv } from "d3-fetch";
    import { scaleLinear, scaleLog, scalePow } from "d3-scale";
    import L from "leaflet";
    import { base } from '$app/paths';
    import DoubleRangeSlider from "./DoubleRangeSlider.svelte";
    import LineChart from "./LineChart.svelte";
    let map;
    let crimeData;
    let geoJsonData;
    let geoJson;

    const geoJsonUrl = base + '/data/russia.geojson'
    let colorScale = scaleLinear().domain([0,1500]).range(['white','red']);
    
    function getCrimeStat(startYear, endYear, region) {
    let totalCrimes = 0; // Initialize total crimes
    let yearCount = endYear - startYear + 1;
    for (let year = startYear; year <= endYear; year++) {
        // Filter data for the given region and year
        let relevantData = crimeData.filter(cD => cD["region"] === region && parseInt(cD["year"]) == year);
        totalCrimes += relevantData.reduce((sum, row) => {
            const value = parseFloat(row["number_of_crimes_per_onehundretthousend"]);
            return sum + (isNaN(value) ? 0 : value);
        }, 0);
    }
    
    return yearCount > 0 ? totalCrimes / yearCount : 0;
}

    
    function style(feature, startingYear, endingYear) {
      return {
          fillColor: colorScale(getCrimeStat(startingYear, endingYear, feature.properties.name_latin)),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
    }
    
    onMount(async () => {
      crimeData = await csv(base + '/data/russCrimes.csv');
      map = L.map("map", { preferCanvas: true }).setView([65,100], 2.8);
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
          maxZoom: 18,
        },
      ).addTo(map);

      const response = await fetch(geoJsonUrl);
      geoJsonData = await response.json();
  
      let startingYear = 2008
      let endingYear = 2023



      function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
          weight: 5,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.7
        });

        layer.bringToFront();
        info.update(layer.feature.properties);
      }

      function resetHighlight(e) {
        let layer = e.target 
        layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: colorScale(getCrimeStat(minSelectedValue, maxSelectedValue, layer.feature.properties.name_latin))
    });
        info.update();
      }

      function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      }

      geoJson = L.geoJson(geoJsonData, {
        style: feature => style(feature, startingYear, endingYear),
        onEachFeature: onEachFeature
      }).addTo(map);

      let info = L.control();

      info.update = function (props) {
        this._div.innerHTML = '<h4>Region</h4>' +  (props ?
          '<b>' + props.name_latin + '</b><br />'
          : 'Hover over a region');
      };


    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    }

    info.addTo(map)
  });

    
  let minSelectedValue = 2008
  let maxSelectedValue = 2023
  let previousMin = 0;
  let previousMax = 0;

  $: if(minSelectedValue || maxSelectedValue){
      if(geoJson)
         geoJson.setStyle(feature => style(feature, minSelectedValue, maxSelectedValue))
      
  } 

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
  <div class="map-container">
    <div id="map"></div>
    <DoubleRangeSlider bind:minSelectedValue bind:maxSelectedValue/>
    <div class="labels">
      <div class="label">{minSelectedValue}</div>
      <div class="label">{maxSelectedValue}</div>
    </div>
  </div>


{#if crimeData}
<LineChart bind:data = {crimeData}  bind:startYear = {minSelectedValue} bind:endYear = {maxSelectedValue} ></LineChart>
{/if}
<style>
  #map {
    height: 500px;
  }

  .map-container{
    position: relative;
    margin: auto;
    width: 80vw;
  }

  .label:first-child {
		float: left;
	}
	.label:last-child {
		float: right;
	}
</style>