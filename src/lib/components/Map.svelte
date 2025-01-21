<script>
    import { onMount } from "svelte";
    import { csv } from "d3-fetch";
    import { scaleLinear, scaleLog, scalePow } from "d3-scale";
    import L from "leaflet";
    import { base } from '$app/paths';
    import DoubleRangeSlider from "./DoubleRangeSlider.svelte";
    let map;
    let crimeData;
    let geoJsonData;
    let geoJson;

    const geoJsonUrl = base + '/data/russia.geojson'
    let minCrime = 100000000;
    let maxCrime = 0;
    const colorScale = scaleLinear().domain([0,2500]).range(['white','red']);
    
    function getCrimeStat(year, region) {
      let relevantData = crimeData.filter(cD => cD["region"] == region && cD["year"] == year);
      let totalCrimes = relevantData.reduce((sum, row) => {const value = parseFloat(row["number_of_crimes_per_onehundretthousend"]);
      return sum + (isNaN(value) ? 0 : value);
      }, 0);
      if(totalCrimes < minCrime)
        minCrime = totalCrimes;
      if(totalCrimes > maxCrime)
        maxCrime = totalCrimes; 
      return totalCrimes;
    }

    
    function style(feature, startingYear, endingYear) {
      return {
          fillColor: colorScale(getCrimeStat(startingYear,feature.properties.name_latin)),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
    }
    
    onMount(async () => {
      crimeData = await csv(base + '/data/russCrimes.csv');
      console.log(crimeData);
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
  
      let startingYear = "2008"
      let endingYear = "2023"



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
        geoJson.resetStyle(e.target);
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
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    }

    info.addTo(map)

    console.log(maxCrime);
    console.log(minCrime);
  });

    
  let minSelectedValue = 2010
  let maxSelectedValue = 2020

  $: if(minSelectedValue || maxSelectedValue){

    let startingYear = minSelectedValue.toString()
    let endingYear = maxSelectedValue.toString()
    console.log(startingYear)
    console.log(endingYear)
    if(geoJson)
      geoJson.setStyle(feature => style(feature, startingYear, endingYear))
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
<div id="map"></div>
<DoubleRangeSlider bind:minSelectedValue bind:maxSelectedValue/>
<p>Selected Range: {minSelectedValue} - {maxSelectedValue}</p>

<style>
  #map {
      height: 480px;
  }

  .info {
      padding: 6px 8px;
      font: 14px/16px Arial, Helvetica, sans-serif;
      background: white;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
      border-radius: 5px;
  }

  .info h4 {
      margin: 0 0 5px;
      color: #777;
  }
</style>