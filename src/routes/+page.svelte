<script>
  import { TextInput } from "$lib";
	import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";

  let gitHubOauth = false;
  let openaiKeyProvided = false;
  let showWelcome = false;

  onMount(() => {
    showWelcome = true;
  });
</script>

<div class="flex flex-col">

  {#if !gitHubOauth && !openaiKeyProvided}
    {#if showWelcome}
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
  {:else}
    <div class="border-b border-gray-500 mb-2 flex items-center px-4">
      <div class="w-18 h-18">
        <img src="/the-github-scrolls.png" alt="GitHub Scrolls">
      </div>
      <h1 class="text-2xl font-bold">GitHub README Generator</h1>
    </div>
    <TextInput />
  {/if}
</div>

