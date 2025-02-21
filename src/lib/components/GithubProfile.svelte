<script lang="ts">
	import '$lib/styles/markdown.css';
	import type { GithubUser, PinnedRepository } from "$lib/types/github";
	import { marked } from "marked";
	import { onMount, tick } from 'svelte';

	let githubUser: GithubUser;
	let loading: boolean = false;
	let error: string = "";
	let gptResponse: string = "";
	let markdownContainer: HTMLElement | null = null;

	onMount(async () => {
		// Get GitHub user info
		const response = await fetch("/github");
		githubUser = await response.json();
	});

	async function gptGenerateRepo(repo: PinnedRepository) {
		loading = true;
		error = "";
		gptResponse = "";

		try {
			const response = await fetch("/openai", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type: "repo", repo})
			});

			if (!response.ok) {
				throw new Error("Failed to get GPT reponse.")
			}
		
			const data = await response.json();
			gptResponse = data.gptResponse;
			await tick();

			// Markdown to HTML
			if (markdownContainer) {
				markdownContainer.innerHTML = await marked.parse(gptResponse);
			}

		} catch (err) {
			error = err instanceof Error ? err.message : "An unknown error has occured."
		} finally {
			loading = false;
		}
	}

	async function gptGenerateProfile() {
		loading = true;
		error = "";
		gptResponse = "";

		try {
			const response = await fetch("/openai", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ type: "profile", githubUser })
			});

			if (!response.ok) {
				throw new Error("Failed to get GPT response.");
			}

			const data = await response.json();
			gptResponse = data.gptResponse;
			await tick();

			// Render Markdown into HTML
			if (markdownContainer) {
				markdownContainer.innerHTML = await marked.parse(gptResponse);
			}

		} catch (err) {
			error = err instanceof Error ? err.message : "An unknown error has occurred.";
		} finally {
			loading = false;
		}
	}

	function downloadMarkdown() {
		if (!gptResponse) return;
		const blob = new Blob([gptResponse], { type: "text/markdown" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");

		a.href = url;
		a.download = "README.md"; // Filename
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("openaiKey"); // Clear OpenAI key
      window.location.href = "/auth/logout"; // Redirect to server-side logout
    }
  }
</script>

<!-- Header -->
<div class="border-b border-gray-500 mb-2 flex items-center px-4">
	<div class="w-16 h-16">
		<img src="/the-github-scrolls.png" alt="GitHub Scrolls">
	</div>
	<h3 class="text-2xl font-bold">The GitHub Scrolls</h3>
	<button on:click={logout} class="ml-auto px-3 py-1 text-white bg-red-700 rounded-lg hover:bg-red-800">
		Logout and Clear Key
	</button>
</div>

{#if githubUser} <!-- Prevent null -->
	<div class="flex items-center justify-around m-4">
		<div class="flex space-x-4 items-center">
			<img src="{githubUser.avatarUrl}" alt="Avatar" class="w-26 h-26 rounded-full">
			<h3 class="text-3xl">{githubUser.name}</h3>
		</div>
		<div>
			<!-- Additional Profile Description Textarea -->
			<h4 class="text-lg mt-4">Generate Profile README:</h4>
			<textarea
				bind:value={githubUser.additionalDesc}
				placeholder="Add more details about yourself..."
				class="w-full p-2 mt-2 resize-none bg-gray-700 text-white border rounded focus:ring-blue-500"
			></textarea>

			<!-- Generate Profile README Button -->
			<button
				on:click={gptGenerateProfile}
				class="w-full mt-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
			>Generate</button>
		</div>
	</div>

	<h4 class="mx-6 text-xl font-bold mt-6">Generate for Pinned Repositories:</h4>
	<div class="flex flex-wrap justify-center space-x-6 mx-6 mb-6">
		{#each githubUser.pinnedRepositories as repo, i}
			<div class="w-85 h-80 p-2 border rounded-lg bg-gray-700 mt-2 flex flex-col justify-between">
				<h5 class="text-md font-bold">{repo.name}</h5>
				<p class="h-24">{repo.description}</p>

				<!-- Small Repository Link Button -->
				<a href="{repo.url}" target="_blank">
					<button class="mt-2 px-2 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none">
						Repo Link
					</button>
				</a>

				<!-- Enable README Checkbox & "Generate Repo README" Button -->
				<div class="flex items-center justify-between mt-2">
					<label class="flex items-center space-x-2">
						<input type="checkbox" bind:checked={repo.enableReadme} />
						<span>Include README.md</span>
					</label>

					<!-- Right-aligned Generate Repo README Button -->
					<button 
						on:click={() => gptGenerateRepo(repo)}
						class="py-2 px-4 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
					>
						Generate
					</button>
				</div>

				<!-- Additional Description Textarea -->
				<textarea
					bind:value={repo.additionalDesc}
					placeholder="Add extra details..."
					class="w-full p-2 mt-2 resize-none text-white border rounded focus:ring-blue-500"
				></textarea>
			</div>
		{/each}
	</div>

	<!-- Markdown output -->
	<div class="flex flex-col justify-center mx-6">
		{#if loading}
			<div class="flex flex-col items-center mt-4">
				<div class="loading-spinner"></div>
			</div>
		{/if}

		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}

		{#if gptResponse}
		<div class="flex justify-center">
			<div class="flex flex-col items-center w-[80%] max-w-2xl">
				<button 
					on:click={downloadMarkdown}
					class="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
				>
					Download as .md
				</button>
				<div class="mt-4 p-2 border rounded-lg bg-gray-700 markdown-body">
					<!-- Render response as Markdown using an HTML element -->
					<div bind:this={markdownContainer}></div>
					<!-- Download Markdown Button -->
					<button
						on:click={downloadMarkdown}
						class="w-full mt-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
					>
						Download as .md
					</button>
				</div>
			</div>
		</div>
		{/if}
	</div>
{/if}