<script>
    export let data;
    export let xScale;
    export let yScale;
  </script>
  
  <div
    class="tooltip"
    style="position: absolute;
  top: {yScale(data.writing_score)}px;
  left: {xScale(data.math_score)}px"
  >
    <h2>Math Score: {data.math_score}</h2>
    <p>Writing Score: {data.writing_score}</p>
  </div>
  
  <style>
    .tooltip {
      padding: 1px;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.5);
      pointer-events: none;
      transition:
        top 300ms ease,
        left 300ms ease;
    }
  
    h2 {
      font-weight: 700;
      margin-bottom: 0.25rem;
      margin-top: 0.1rem;
    }
  </style>