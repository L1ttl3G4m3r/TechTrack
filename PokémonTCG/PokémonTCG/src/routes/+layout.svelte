<script>
  import './global.css';
  import favicon from "$lib/Images/pokeball.png";
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<slot />
