<script lang="ts">
	import type { GithubUser, PinnedRepository } from "$lib/types/github";
	import { writable } from "svelte/store";

	// Props passed from parent (TextInput.svelte)
	export let githubUser: GithubUser;

	// Store for managing README enable state and additional descriptions per repo
	let repoSettings = writable(
		githubUser.pinnedRepositories.map((repo) => ({
			...repo,
			enableReadme: false,
			additionalDescription: ""
		}))
	);

	function generateReadme() {
		repoSettings.subscribe((repos) => {
			const readmeContent = `# ${githubUser.name}\n\n${githubUser.bio || ""}\n\n## Pinned Repositories\n` + 
				repos.map(repo =>
					`### [${repo.name}](${repo.url})\n${repo.description || ""}\n${repo.enableReadme && repo.readme ? `\n**README Content:**\n${repo.readme}` : ""}\n${repo.additionalDescription ? `\n**Additional Notes:**\n${repo.additionalDescription}` : ""}`
				).join("\n\n");

			console.log("Generated README:\n", readmeContent);
		});
	}
</script>

<div class="w-120 p-4 border rounded-lg bg-gray-800 text-white">
	<img src="{githubUser.avatarUrl}" alt="Avatar" class="w-16 h-16 rounded-full mb-2">
	<h3 class="text-lg font-bold">{githubUser.name}</h3>
	<p>{githubUser.bio}</p>
	<a href="{githubUser.websiteUrl}" class="text-blue-400" target="_blank">Website</a>

	<!-- Display Pinned Repositories -->
	<h4 class="text-lg font-bold mt-4">Pinned Repositories:</h4>
	{#each $repoSettings as repo, i}
		<div class="p-2 border rounded-lg bg-gray-700 mt-2">
			<h5 class="text-md font-bold">{repo.name}</h5>
			<p>{repo.description}</p>
			<a href="{repo.url}" class="text-blue-400 hover:underline" target="_blank">Repository Link</a>

			<!-- Enable README Checkbox -->
			<label class="flex items-center space-x-2 mt-2">
				<input type="checkbox" bind:checked={repo.enableReadme} />
				<span>Include README.md</span>
			</label>

			<!-- Additional Description Textarea -->
			<textarea
				bind:value={repo.additionalDescription}
				placeholder="Add extra details..."
				class="w-full p-2 mt-2 resize-none text-white border rounded focus:ring-blue-500"
			></textarea>
		</div>
	{/each}

	<!-- Generate README Button -->
	<button
		on:click={generateReadme}
		class="w-full mt-4 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none"
	>
		Generate README
	</button>
</div>
