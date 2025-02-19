<script>
  import { AuthLanding, TextInput } from "$lib";

  let gitHubOauth = false;
  let openaiKeyProvided = false;
</script>

<div class="flex flex-col">

  {#if !gitHubOauth && !openaiKeyProvided}
    <AuthLanding />
  {:else}
    <div class="border-b border-gray-500 mb-2 flex items-center px-4">
      <div class="w-18 h-18">
        <img src="/the-github-scrolls.png" alt="GitHub Scrolls">
      </div>
      <h1 class="text-2xl font-bold">GitHub README Generator</h1>
    </div>
    <TextInput />
  {/if}
</div>

