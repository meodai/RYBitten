<script lang="ts">
  export let hasPerspective = true;
</script>

<div class="donut{ hasPerspective ? ' donut--perspective' : ''}">
  <div class="donut__segments">
  </div>
</div>

<style>
  .donut {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
  }

  .donut--perspective {
    perspective: 10000px;
  }

  .donut__segments {
    position: absolute;
    inset: 0;
    background: conic-gradient(var(--stops-48));
    border-radius: 50%;
  }

  .donut--perspective .donut__segments {
    transform-style: preserve-3d;
    transform: rotateX(45deg);
  }

  .donut__segments::after {
    content: '';
    inset: 0;
    position: absolute;
    background: var(--bg);
    transform: scale(.7);
    border-radius: 50%;
    transition: 200ms transform cubic-bezier(0.3, 0.7, 0, 1);
  }

  .donut__segments:hover::after {
    transform: scale(.35);
  }
</style>