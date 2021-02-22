<script>
  import Modal from "./Modal.svelte";

  export let message;
</script>

<Modal title="An error occurred!" on:close-modal>
  <p>{message}</p>
</Modal>

<style>
  p {
    margin: 1rem;
  }
</style>
