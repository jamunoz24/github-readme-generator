<script>
	let username = "";
	/**
	 * @type {{ data: { user: { avatarUrl: any; name: any; bio: any; websiteUrl: any; pinnedItems: { nodes: { name: any; description: any; url: any; }[]; }; }; }; } | null}
	 */
	let userData = null;
	let loading = false;
	let error = "";

	async function sendMessage() {
		if (!username.trim()) return; // Prevent empty messages

		loading = true;
		error = "";

		console.log("Sent:", { title: username });
		try {
			const response = await fetch(`/github?username=${username}`);
			if (!response.ok) {
				throw new Error("Failed to fetch user data");
			}

			userData = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : "An unknown error occurred";
		} finally {
			loading = false;
		}
	}

	/**
	 * @param {{ key: string; preventDefault: () => void; }} event
	 */
	function handleKeydown(event) {
		if (event.key === "Enter") {
			event.preventDefault(); // Prevent form submission (if inside a form)
			sendMessage();
		}
	}
</script>

<div class="flex flex-col items-center space-y-4 w-120">
	<!-- Username Textbox -->
  <h2 class="text-lg font-bold self-start m-1">Github Username:</h2>
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
		<p class="text-gray-500">Loading...</p>
	{/if}

	<!-- Error Message -->
	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}

	<!-- Display GitHub Data -->
	{#if userData}
		<div class="w-120 p-4 border rounded-lg bg-gray-800">
			<img src="{userData.data.user.avatarUrl}" alt="Avatar" class="w-16 h-16 rounded-full mb-2">
			<h3 class="text-lg font-bold">{userData.data.user.name}</h3>
			<p>{userData.data.user.bio}</p>
			<a href="{userData.data.user.websiteUrl}" class="text-blue-600" target="_blank">Website</a>
			
			<!-- Display Pinned Repositories -->
			<h4 class="text-lg font-bold mt-4">Pinned Repositories:</h4>
			{#each userData.data.user.pinnedItems.nodes as repo}
				<div class="p-2 border rounded-lg bg-gray-700 mt-2">
					<h5 class="text-md font-bold">{repo.name}</h5>
					<p>{repo.description}</p>
					<a href="{repo.url}" class="text-blue-600" target="_blank">Repository Link</a>
				</div>
			{/each}
		</div>
	{/if}
</div>
