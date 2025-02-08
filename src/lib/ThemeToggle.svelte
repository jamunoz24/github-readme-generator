<script>
  import { onMount } from "svelte";

  let theme = "dark";

  onMount(() => {
    theme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", theme);
  });

  function toggleTheme() {
    theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
</script>

<button 
  on:click={toggleTheme}
  class="px-4 py-2 rounded bg-primary text-theme border border-gray-300 hover:opacity-80 transition"
>
  {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
</button>
