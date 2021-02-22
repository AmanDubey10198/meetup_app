<script>
  export let type = "button";
  export let href = null;
  export let mode = null;
  export let color = null;
  export let disabled = false;
</script>

{#if href}
  <a {href} class="href-btn"><slot /></a>
{:else}
  <button {type} class="{mode} {color}" class:disabled {disabled} on:click
    ><slot /></button
  >
{/if}

<style>
  button {
    background-color: #cf0056;
    color: white;
    border-radius: 5px;
    border: none;
    outline: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    display: inline-block;
    margin: auto 5px;
  }
  button:hover {
    box-shadow: 0 0 1px 1px #00000042;
  }

  .outline {
    box-shadow: 0 0 5px 3px pink;
  }

  .success {
    background-color: #1ac745;
  }
  .disabled {
    opacity: 0.6;
  }

  .href-btn {
    color: #cf0056;
    border-radius: 5px;
    border: 1px solid #cf0056;
    outline: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    display: inline-block;
    margin: auto 5px;
    text-decoration: none;
  }
  .href-btn:hover {
    text-decoration: underline;
  }
</style>
