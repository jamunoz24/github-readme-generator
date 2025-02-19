<script lang="ts">
	import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";

  let showTransition = false;
  let loggedIn = false;
  let openaiKey = "";

  onMount(async () => {
    showTransition = true;

    // Check if user is authenticated
    const response = await fetch("/auth/check");
    const data = await response.json();
    loggedIn = data.loggedIn;
  });

  function signInWithGitHub() {
    window.location.href = "/auth";  // Redirects to GitHub OAuth
  }

  function saveOpenaiKey() {
    if (!openaiKey.trim()) {
      alert("Please enter a valid OpenAI API key.");
      return;
    }

    localStorage.setItem("openaiKey", openaiKey);
    alert("OpenAI API Key saved!");

    // Notify +page.svelte that the key has been updated
    window.dispatchEvent(new Event("openaiKeyUpdated"));
  }
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

      <div class="flex flex-col w-120 text-center items-center space-y-2 text-gray-400"
      in:fade={{ duration: 2800, delay: 2800}}>
        <p>The GitHub Scrolls is a readme generator. Whether it is for a repository or your GitHub profile, this application uses ChatGPT to generate you an appealing readme file in md format.</p>
        <p>This application requires a GitHub authenticated sign-in, as well as an OpenAI API secret key to start generating.</p>

        {#if loggedIn}
          <p class="mt-4 text-green-400">✅ You are logged in with GitHub!</p>
        {:else}
          <button on:click={signInWithGitHub}
            class="mt-4 px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700">
            Sign in with GitHub
          </button>
        {/if}

        <div class="w-100 mt-2 flex flex-col items-center">
          <label class="text-gray-300">Enter Your OpenAI API Key:
            <input type="password" bind:value={openaiKey}
              class="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white" />
          </label>
          <button on:click={saveOpenaiKey}
            class="mt-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700">
            Save OpenAI Key
          </button>
        </div>

      </div>
    </div>
  </div>
{/if}