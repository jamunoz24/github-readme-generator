<script lang="ts">
	import type { GithubUser } from "../types/github";
	import { GithubProfile } from "$lib";

	let username = "";
	let error = "";
	let loading = false;
	let githubUser: GithubUser | null = null;

	async function sendMessage() {
		if (!username.trim()) return; // Prevent empty messages
		githubUser = null; // Reset the profile

		loading = true;
		error = "";

		console.log("Sent:", { title: username });
		try {
			const response = await fetch(`/github?username=${username}`);
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}

			githubUser = await response.json();
			console.log(githubUser);
		} catch (err) {
			error = err instanceof Error ? err.message : "An unknown error occurred";
		} finally {
			loading = false;
		}
	}

	function handleKeydown(event: any) {
		if (event.key === "Enter") {
			event.preventDefault(); // Prevent form submission (page reload)
			sendMessage();
		}
	}
</script>

<div class="flex flex-col items-center space-y-4  mb-6">
	<!-- Username Textbox -->
  <h2 class="text-lg font-bold w-120 m-1">Github Username:</h2>
	<input
		bind:value={username}
		on:keydown={handleKeydown}
		placeholder="Type a username..."
		class="w-120 h-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
	/>
	
	<!-- Send Button -->
	<button
		on:click={sendMessage}
		class="w-120 h-10 px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none"
	>
		Fetch Profile
	</button>

	<!-- Loading Indicator -->
	{#if loading}
		<div class="loading-spinner"></div>
	{/if}

	<!-- Error Message -->
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}

	<!-- Display GitHub Data in GithubProfile Component -->
	{#if githubUser}
		<GithubProfile {githubUser} />
	{/if}

</div>
