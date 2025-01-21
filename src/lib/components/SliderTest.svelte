<script>
    import DoubleRangeSlider from './DoubleRangeSlider.svelte';

    let minSelected = 2008;
    let maxSelected = 2010;
</script>

<DoubleRangeSlider
    minValue={2008}
    maxValue={2023}
    step={1}
    bind:minSelectedValue={minSelected}
    bind:maxSelectedValue={maxSelected}
/>
<p>{minSelected} - {maxSelected}</p>