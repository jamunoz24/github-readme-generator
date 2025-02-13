<script lang="ts">
	import '$lib/styles/markdown.css';
	import type { GithubUser, PinnedRepository } from "$lib/types/github";
	import { marked } from "marked";
	import { tick } from 'svelte';
	import { writable } from "svelte/store";

	export let githubUser: GithubUser;
	let loading = false;
	let error = "";
	let gptResponse = "";
	let markdownContainer: HTMLElement | null = null;

	// Store for managing README enable state and additional descriptions per repo
	let repoSettings = writable(
		githubUser.pinnedRepositories.map((repo) => ({
			...repo,
			enableReadme: false,
			additionalDescription: ""
		}))
	);

	// Store for additional profile description
	let additionalProfileDescription = "";

	function generateReadme() {
		repoSettings.subscribe((repos) => {
			const readmeContent = `# ${githubUser.name}\n\n${githubUser.bio || ""}\n\n${additionalProfileDescription ? `**Additional Profile Notes:**\n${additionalProfileDescription}\n\n` : ""}## Pinned Repositories\n` + 
				repos.map(repo =>
					`### [${repo.name}](${repo.url})\n${repo.description || ""}\n${repo.enableReadme && repo.readme ? `\n**README Content:**\n${repo.readme}` : ""}\n${repo.additionalDescription ? `\n**Additional Notes:**\n${repo.additionalDescription}` : ""}`
				).join("\n\n");

			console.log("Generated README:\n", readmeContent);
		});
	}

	function generateRepoReadme(repoName: string, readme: string | null, additionalDescription: string) {
		const repoReadmeContent = `# ${repoName}\n\n${readme || ""}\n\n${additionalDescription ? `**Additional Notes:**\n${additionalDescription}` : ""}`;
		console.log(`Generated README for ${repoName}:\n`, repoReadmeContent);
	}

	async function gptGenerate() {
		loading = true;
		error = "";
		gptResponse = "";

		try {
			const response = await fetch("/openai", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ githubUser })
			});

			if (!response.ok) {
				throw new Error("Failed to get OpenAI response");
			}

			const data = await response.json();
			gptResponse = data.gptResponse;

			await tick();

			// Render Markdown into HTML
			if (markdownContainer) {
				markdownContainer.innerHTML = await marked.parse(gptResponse);
			}

		} catch (err) {
			error = err instanceof Error ? err.message : "An unknown error occurred";
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

</script>

<div class="w-120 p-4 border rounded-lg bg-gray-800 text-white">
	<img src="{githubUser.avatarUrl}" alt="Avatar" class="w-16 h-16 rounded-full mb-2">
	<h3 class="text-lg font-bold">{githubUser.name}</h3>
	<p>{githubUser.bio}</p>
  {#if githubUser.websiteUrl}
	  <a href="{githubUser.websiteUrl}" class="text-blue-400" target="_blank">My Website</a>
  {/if}

	<!-- Display Pinned Repositories -->
	<h4 class="text-lg font-bold mt-4">Pinned Repositories:</h4>
	{#each $repoSettings as repo, i}
		<div class="p-2 border rounded-lg bg-gray-700 mt-2 relative">
			<h5 class="text-md font-bold">{repo.name}</h5>
			<p>{repo.description}</p>

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
					on:click={() => generateRepoReadme(repo.name, repo.readme, repo.additionalDescription)}
					class="px-3 py-1 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
				>
					Generate Repo README
				</button>
			</div>

			<!-- Additional Description Textarea -->
			<textarea
				bind:value={repo.additionalDescription}
				placeholder="Add extra details..."
				class="w-full p-2 mt-2 resize-none text-white border rounded focus:ring-blue-500"
			></textarea>
		</div>
	{/each}

	<!-- Additional Profile Description Textarea -->
	<h4 class="text-lg font-bold mt-4">Additional Profile Description:</h4>
	<textarea
		bind:value={additionalProfileDescription}
		placeholder="Add more details about yourself..."
		class="w-full p-2 mt-2 resize-none bg-gray-700 text-white border rounded focus:ring-blue-500"
	></textarea>

	<!-- Generate Profile README Button -->
	<button
		on:click={gptGenerate}
		class="w-full mt-4 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
	>
		Generate Profile README
	</button>

  {#if loading}
		<div class="flex flex-col items-center mt-4">
			<div class="loading-spinner"></div>
		</div>
	{/if}

	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}

	{#if gptResponse}
		<div class="mt-4 p-2 border rounded-lg bg-gray-700 markdown-body">
			<h4 class="text-md font-bold">README:</h4>
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
	{/if}
</div>
