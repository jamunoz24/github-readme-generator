<script>
	let message = "";
	let username = "";

	function sendMessage() {
		if (!message.trim() || !username.trim()) return; // Prevent empty messages
		console.log("Sent:", { title: username, message });
		message = ""; // Clear input after sending
		username = ""; // Clear title after sending
	}
</script>

<div class="flex flex-col items-center space-y-4 w-120">
	<!-- Username Textbox -->
  <h2 class="text-lg font-bold self-start m-1">Github Username:</h2>
	<input
		bind:value={username}
		placeholder="Type a username..."
		class="w-120 h-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
	/>

	<!-- Textbox -->
	<textarea
		bind:value={message}
		placeholder="Type a message..."
		class="w-120 h-25 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
	></textarea>

	<!-- Send Button -->
	<button
		on:click={sendMessage}
		class="w-120 h-10 px-4 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 focus:outline-none"
	>
		Send
	</button>
</div>
