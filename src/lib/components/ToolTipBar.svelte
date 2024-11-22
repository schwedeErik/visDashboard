<script>
    export let data;
    export let xScale;
    export let yScale;
  </script>
  
  <div
    class="tooltip"
    style="position: absolute;
  top: {yScale(data.score) + 20}px;
  left: {xScale(data.group) + 20}px"
  >

  <div class='Score'>
    <h2>Math Score: </h2>
    <p2 class='ExamScore'> {data.score}% </p2>
  </div>
  
  </div>
  
  <style>
    .tooltip {
      padding: 1px;
      background: rgba(255, 255, 255, 0.5);
      border: 3px solid purple;
      border-radius: 10px;
      pointer-events: none;
      transition:
        top 100ms ease,
        left 100ms ease;
    }
  
    h2 {
      font-weight: 700;
      margin-bottom: 0.25rem;
      margin-top: 0.1rem;
    }

    .ExamScore {
      background-color: purple;
      color: white;
      border-radius: 2px;
      padding: 3px;
    }

    .Score {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }
  </style>