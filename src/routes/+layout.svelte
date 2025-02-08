<script lang="ts">
	import '../app.css';
	import ThemeToggle from '$lib/ThemeToggle.svelte';

	let { children } = $props();
</script>

<div data-theme="light" class="bg-theme text-theme min-h-screen transition-colors duration-300">

	{@render children()}
</div>