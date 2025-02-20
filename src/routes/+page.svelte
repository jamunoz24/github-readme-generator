<script lang="ts">
  import { AuthLanding, TextInput } from "$lib";
	import GithubProfile from "$lib/components/GithubProfile.svelte";
	import { onMount, onDestroy } from "svelte";

  let gitHubOauth: boolean = false;
  let openaiKeyProvided: boolean = false;

  async function checkAuthStatus() {
    // Check if user is authenticated with GitHub
    const response = await fetch("/auth/user");
    const data = await response.json();
    gitHubOauth = data.loggedIn;

    // Check if an OpenAI API key is stored
    openaiKeyProvided = !!localStorage.getItem("openaiKey");
  }

  onMount(() => {
    checkAuthStatus();
    // Listen for OpenAI key updates from AuthLanding.svelte
    window.addEventListener("openaiKeyUpdated", checkAuthStatus);
  
    // Listen for messages from the popup window
    window.addEventListener("message", async (event) => {
      if (event.origin !== window.location.origin) return; // Security check
      if (event.data.github_token) {
        console.log("GitHub token received:", event.data.github_token);
        checkAuthStatus(); // Update UI when authenticated
      }
    });
  });

  // onDestroy(() => {
  //   window.removeEventListener("openaiKeyUpdated", checkAuthStatus);
  // });
  
  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("openaiKey"); // Clear OpenAI key
      window.location.href = "/auth/logout"; // Redirect to server-side logout
    }
  }
</script>

<div class="flex flex-col">
  {#if !gitHubOauth || !openaiKeyProvided}
    <AuthLanding />
  {:else}
    <div class="border-b border-gray-500 mb-2 flex items-center px-4">
      <div class="w-16 h-16">
        <img src="/the-github-scrolls.png" alt="GitHub Scrolls">
      </div>
      <h3 class="text-2xl font-bold">The GitHub Scrolls</h3>
      <button on:click={logout} class="ml-auto px-3 py-1 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">
        Logout
      </button>
    </div>
    <GithubProfile />
  {/if}
</div>