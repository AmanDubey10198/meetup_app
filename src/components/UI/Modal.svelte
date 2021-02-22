<script>
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import Button from "./Button.svelte";
  const dispatch = createEventDispatcher();

  export let title;
</script>

<div
  in:fade={{ delay: 0, duration: 200 }}
  out:fade={{ delay: 50, duration: 200 }}
  class="backdrop"
  on:click={() => dispatch("close-modal")}
/>
<div
  class="modal"
  in:fly={{ delay: 200, duration: 500, x: 0, y: -500 }}
  out:fly={{ delay: 0, duration: 200, x: 0, y: -500 }}
>
  <h1>{title}</h1>
  <div class="content"><slot /></div>
  <footer>
    <slot name="footer">
      <Button on:click={() => dispatch("close-modal")}>Close</Button>
    </slot>
  </footer>
</div>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }

  .modal {
    position: fixed;
    top: 10vh;
    left: 10%;
    width: 80%;
    background: white;
    border-radius: 5px;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    overflow: auto;
  }
  h1 {
    text-align: center;
  }
  footer {
    padding: 1rem;
    border-top: 1px solid #ccc;
    text-align: center;
  }
</style>
