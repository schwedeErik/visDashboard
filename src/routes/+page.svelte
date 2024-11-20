<script>
    //const { data } = $props()

    import Papa from 'papaparse';
    import { base } from '$app/paths';
    import { onMount } from 'svelte';

    let students = []

    onMount(async () => {
        const response = await fetch(base + '/data/StudentsPerformance.csv', { headers: { 'Content-Type': 'text/csv' }})
        let csvStudents = await response.text()
        let parsedCsvStudents = Papa.parse(csvStudents, {header: true})
        students = parsedCsvStudents.data
    });
  </script>
  
  <ul>
    {#each students as student}
    <li>{student.gender}</li>
    {/each}
  </ul>