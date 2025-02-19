<script>
	import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";

  let showTransition = false;

  onMount(() => {
    showTransition = true;
  });
</script>

<!-- Remount to show transition animation -->
{#if showTransition}
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-6xl "
      in:fly={{ y: -30, opacity:0, duration: 2000, delay: 300 }}>
      Welcome
    </h1>
    <div in:fade={{ duration: 1500, delay: 800}}>
      <p>lalala</p>
    </div>
  </div>
{/if}