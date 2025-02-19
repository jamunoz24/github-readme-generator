<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div data-theme="dark" class="bg-theme text-theme min-h-screen">
	{@render children()}
</div>