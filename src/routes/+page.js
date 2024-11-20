//import Papa from 'papaparse';
//import { base } from '$app/paths';
//import { onMount } from 'svelte';

//let flights = []

//onMount(async () => {
//    const response = await fetch(base + '/data/StudentsPerformance.csv', { headers: { 'Content-Type': 'text/csv' }})
//    let csvFlights = await response.text()
//    let parsedCsvFlights = Papa.parse(csvFlights, {header: true})
//    flights = parsedCsvFlights.data
//    flights = await response.json()
//  });



//export async function load({ fetch, params }) {
//    const responseFlights = await fetch('https://jan-to.github.io/WebDataVis/flights_part.csv', 
//      { headers: { 'Content-Type': 'text/csv' } })
//    let csvFlights = await responseFlights.text()
//    let parsedCsvFlights = Papa.parse(csvFlights, {header: true})
//    return { flights: parsedCsvFlights.data }
//}