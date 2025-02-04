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
    $: selectedRegion = 'Russian Federation';

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
        selectedRegion = layer.feature.properties.name_latin;
      }

      function resetHighlight(e) {
        let layer = e.target 
        layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: colorScale(getCrimeStat(minSelectedValue, layer.feature.properties.name_latin))
        });
        selectedRegion = 'Russian Federation';
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
  });

    
  let minSelectedValue = 2008
  let maxSelectedValue = 2023
  let highCatagories = ["Theft", "Crimes in the Sphere of Economic Activity", "Robbery without violence"];
  let lowCatagories = ["Murder", "Rape", "Robbery with violence", "Extortion", "Hooliganism", "Intentional Bodily Harm"]
  $: if(minSelectedValue || maxSelectedValue){
      if(geoJson)
         geoJson.setStyle(feature => style(feature, minSelectedValue))
      
  } 

  $: if(selectedRegion){

  }

</script>
  <div class="main-div">
    <div class="map-container">
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
  

<style>

  .main-div{
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .chart-container{
    display: flex;

    flex-direction: row; /* Align charts horizontally */
    justify-content: center; /* Center the charts horizontally in the container */
    height: 40vh;  
    width: 80%; /* Full width of parent container */
    gap: 1rem; /* Space between charts */
    margin: 0 auto; /* Center the container itself */
  }
  .chart-lineContainer{
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
  }


  #map{
        height: 50vh;
    }

  .main-map{
    outline: 2px solid;
  }

  .legend-container{
    position: absolute;
    bottom: 10px; 
    left: 10px;   
    z-index: 1000; 
    background: rgba(255, 255, 255, 0.5); 
    padding: 5px; 
    border-radius: 4px; 
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); 
  }

  .map-container{
    /* outline-style: dashed; */
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