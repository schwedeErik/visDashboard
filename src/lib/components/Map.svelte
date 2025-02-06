<script>
    import { onMount } from "svelte";
    import { csv } from "d3-fetch";
    import { scaleSequential} from "d3-scale";
    import { interpolateRdYlBu } from 'd3-scale-chromatic';
    import L from "leaflet";
    import { base } from '$app/paths';
    import LineChart from "./LineChart.svelte";
    import GradientLedgend from "./GradientLedgend.svelte";
    import BarChart from "./BarChart.svelte";
    import 'leaflet/dist/leaflet.css';
    let map;
    let crimeData;
    let geoJsonData;
    let geoJson;
    let selectedRegion = 'Russian Federation';
    let selectionIsFixed = false;

    const russiaBounds = L.latLngBounds(
    [41.1851, 19.6389], 
    [82.0586, 180.0000]);

    const geoJsonUrl = base + '/data/russia.geojson'
    //let colorScale = scaleLinear().domain([0,1500]).range(['white','red']);
    let colorScale = scaleSequential()
      .interpolator(interpolateRdYlBu) 
      .domain([1500, 0]);

    function getCrimeStat(year, region) {
      let totalCrimes = 0; // Initialize total crimes
        
      // Filter data for the given region and year
      let relevantData = crimeData.filter(cD => cD["region"] === region && parseInt(cD["year"]) == year);
          totalCrimes += relevantData.reduce((sum, row) => {
              const value = parseFloat(row["number_of_crimes_per_onehundretthousend"]);
              return sum + (isNaN(value) ? 0 : value);
          }, 0);
      return totalCrimes;
}

    
    function style(feature, year) {
      return {
          fillColor: colorScale(getCrimeStat(year, feature.properties.name_latin)),
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7
      };
    }

    function setHighlightByName(regionName) {
        geoJson.eachLayer(function (layer) {
          const region = layer.feature.properties.name_latin;

          // Skip resetting the style for the excluded region
          if (region == regionName) {
            layer.setStyle({
              weight: 5,
              color: '#666',
              dashArray: '',
              fillOpacity: 0.7,
              fillColor: colorScale(getCrimeStat(minSelectedValue, region)),
            });
          }
        });
      }
    
    onMount(async () => {
      crimeData = await csv(base + '/data/russCrimes.csv');
      map = L.map("map", { preferCanvas: true,
                            zoomSnap: 0.1, // Allows fractional zoom levels
                            zoomDelta: 0.1, // Allows zooming in 0.5 increments
       });

       // Define the bounding box (southwest and northeast corners)
  const bounds = L.latLngBounds(
    [30, -20],   // Southwest corner (latitude, longitude)
    [85, 210]   // Northeast corner (latitude, longitude)
  );

  // Set the max bounds to limit the scrollable area
  map.setMaxBounds(bounds);

  // Optional: Add some "friction" to prevent dragging outside the bounds
 
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
        
        if(selectionIsFixed)
          return;

        selectedRegion = layer.feature.properties.name_latin;
      }
      
      function resetHighlightByName(regionName) {
        geoJson.eachLayer(function (layer) {
          const region = layer.feature.properties.name_latin;

          // Skip resetting the style for the excluded region
          if (region == regionName) {
            layer.setStyle({
              weight: 2,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.7,
              fillColor: colorScale(getCrimeStat(minSelectedValue, region)),
            });
          }
        });
      }
      
      
      function resetHighlight(e) {
        let layer = e.target 
        let region = layer.feature.properties.name_latin;
        
        if(!(selectionIsFixed && selectedRegion == region)){
          layer.setStyle({
          weight: 2,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7,
          fillColor: colorScale(getCrimeStat(minSelectedValue, layer.feature.properties.name_latin))
          });
        }
        

        if(!selectionIsFixed)
          selectedRegion = 'Russian Federation';
        info.update();
      }

      

      function zoomToFeature(e) {
        //map.fitBounds(e.target.getBounds());
        let clickedRegion = e.target.feature.properties.name_latin;
        console.log("Clicked" + clickedRegion)
        console.log("Selected" + selectedRegion)
        
        
        if(clickedRegion == selectedRegion && !selectionIsFixed){
          selectionIsFixed = true;
          return;
        }
          

        if(clickedRegion == selectedRegion && selectionIsFixed){
          selectionIsFixed = false;
          return;
        }

        if(clickedRegion != selectedRegion){
          selectionIsFixed = true;
          resetHighlightByName(selectedRegion);
          selectedRegion = clickedRegion;
          return;
        }
          
      }

      function onEachFeature(feature, layer) {
        layer.on({
          mouseover: highlightFeature,
          mouseout: resetHighlight,
          click: zoomToFeature
        });
      }

      geoJson = L.geoJson(geoJsonData, {
        style: feature => style(feature, startingYear),
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
    
    map.fitBounds(russiaBounds, {padding: [20,20]})
    // Ensure the map resizes properly on load and when resizing the window
    setTimeout(() => {
        map.invalidateSize();
    }, 100); // Delay slightly to ensure proper resizing

    window.addEventListener('resize', () => {
        map.invalidateSize(); // Recalculate map size on window resize
        
        map.fitBounds(russiaBounds, { padding: [20, 20] })
    });
  });

    
  let minSelectedValue = 2008
  let maxSelectedValue = 2023
  let highCatagories = ["Theft", "Crimes in the Sphere of Economic Activity", "Robbery without violence"];
  let lowCatagories = ["Murder", "Rape", "Robbery with violence", "Extortion", "Hooliganism", "Intentional Bodily Harm"]
  $: if(minSelectedValue || maxSelectedValue){
      if(geoJson){
        geoJson.setStyle(feature => style(feature, minSelectedValue))
        setHighlightByName(selectedRegion)
      }
         
      
  } 

  $: if(selectedRegion){

  }

  function resetView() {
    if (map) {
        map.flyToBounds(russiaBounds, {
            padding: [20, 20],
            duration: 0.5,
            easeLinearity: 0.25,
        });
    }
}

</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
</svelte:head>


  <div class="main-div">
    <header class="dashboard-header">
      <h1>Crimes in Russia (2008-2023)</h1>
    </header>
    <div class="main-content">
      <div class="map-container">
        <div class="year-display leaflet-control">Crimes in {minSelectedValue}</div>
        <button class="reset-button leaflet-control" on:click={resetView} aria-label="Reset View">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <polyline points="1 20 1 14 7 14"></polyline>
            <path d="M3.51 9a9 9 0 0 1 14.61-3L23 10"></path>
            <path d="M20.49 15a9 9 0 0 1-14.61 3L1 14"></path>
          </svg>
        </button>
        <div class="main-map">
          <div  id="map"></div>
          <div class="legend-container">
            <GradientLedgend width={400} height={30} domain={[1500, 0]} />      
          </div>
        </div>
      </div>
  
  
    {#if crimeData}
    <div class="chart-container">
      <div class="chart-lineContainer">
        <LineChart bind:data = {crimeData}  bind:startYear = {minSelectedValue} bind:categories ={highCatagories}> </LineChart>
        <LineChart bind:data = {crimeData}  bind:startYear = {minSelectedValue} bind:categories ={lowCatagories}></LineChart>
      </div>
        <BarChart bind:data = {crimeData} region = {selectedRegion} bind:year = {minSelectedValue}></BarChart>
    </div>
    
    {/if}
  </div>
  </div>
  

<style>

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  overflow: hidden; /* Prevent global scrolling */
}

.main-div {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 98vh; /* Full height */
  margin: 0;
}

.map-container {
  position: relative;
  flex: 1; /* Map takes remaining height */
  width: 100%; /* Full width within the parent */
  margin: 0;
  overflow: hidden; /* Prevent map scrolling issues */
}

.chart-container {
  display: flex;
  flex-direction: row; /* Align charts horizontally */
  justify-content: center;
  height: 55%; /* Adjust height for charts */
  width: 100%; /* Full width within the parent */
  gap: 1rem; /* Space between charts */
  overflow: hidden; /* Avoid overflow */
}

.chart-lineContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  margin: 0 10px;
}

#map {
  height: 100%; /* Fill parent container */
  width: 100%; /* Full width */
}

.main-map {
  position: relative;
  height: 100%; /* Fill map container */
  width: 100%; /* Full width */
  outline: 1px solid #ddd; /* Optional: Clean border outline */
}

.legend-container {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.7); /* Semi-transparent background */
  padding: 5px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.year-display {
  position: absolute;
  top: 10px;
  left: 50px;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  color: white;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  text-align: center;
  min-width: 60px;
  z-index: 1000;
}

.main-content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 96%; /* Adjust height to fill the remaining space */
  width: 96%; /* Slight margin for aesthetics */
  margin: 0 auto;
  border: 1px solid #ddd; /* Add the border here */
  border-radius: 8px; /* Rounded corners for cleaner look */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Add shadow */
  overflow: hidden;
}
* {
  box-sizing: border-box;
}
.reset-button {
  position: absolute;
  top: 80px;
  left: 10px;
  background-color: white;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
  z-index: 1000;
  width: 32px; /* Square button */
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-button:hover {
  background-color: #f4f4f4;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.reset-button svg {
  width: 20px;
  height: 20px;
  stroke: black;
}

.dashboard-header {
  text-align: center;
  padding: 10px 0;
  background-color: #fff;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.dashboard-header h1 {
  margin: 0; /* Remove default margins */
  text-transform: uppercase;
  letter-spacing: 1px;
}

</style>