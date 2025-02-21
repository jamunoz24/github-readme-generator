<script lang="ts">
  import { AuthLanding } from "$lib";
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
        checkAuthStatus(); // Update UI when authenticated
      }
    });
  });

  onDestroy(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("openaiKeyUpdated", checkAuthStatus);
    }
  });
</script>

<div class="flex flex-col">
  {#if !gitHubOauth || !openaiKeyProvided}
    <AuthLanding />
  {:else}
    <GithubProfile />
  {/if}
</div>