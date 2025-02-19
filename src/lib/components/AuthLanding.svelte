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
    <h1 class="text-7xl mb-2"
      in:fly={{ y: -60, opacity:0, duration: 3000, delay: 500 }}>
      Welcome
    </h1>

    <div class="flex flex-col items-center">
      <div class="flex items-center my-2 space-x-2"
      in:fade={{ duration: 2400, delay: 1800}}>
        <div class="w-18 h-18">
          <img src="/the-github-scrolls.png" alt="GitHub Scrolls">
        </div>
        <h4 class="text-4xl">The GitHub Scrolls</h4>
        <div class="w-18 h-18">
          <img src="/the-github-scrolls.png" alt="GitHub Scrolls">
        </div>
      </div>

      <div class="w-120 text-center space-y-2 text-gray-400"
      in:fade={{ duration: 2800, delay: 3000}}>
        <p>The GitHub Scrolls is a readme generator. Whether it is for a repository or your GitHub profile, this application uses ChatGPT to generate you an appealing readme file in md format.</p>
        <p>This application requires a GitHub authenticated sign-in, as well as an OpenAI API secret key to start generating.</p>
      </div>
    </div>

  </div>
{/if}