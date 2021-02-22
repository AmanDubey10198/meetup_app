<script>
  export let controlType = "text";
  export let id;
  export let label;
  export let rows = null;
  export let value;
  export let valid = true;
  export let validityMessage = "";
  let touched = false;
</script>

<div class="form-control">
  {#if controlType === "textarea"}
    <label for={id}>{label}</label>
    <textarea
      class:invalid={!valid && touched}
      {rows}
      {id}
      bind:value
      on:blur={() => (touched = true)}
    />
  {:else}
    <label for={id}>{label}</label>
    <input
      class:invalid={!valid && touched}
      type="text"
      {id}
      bind:value
      on:blur={() => (touched = true)}
    />
  {/if}
</div>

{#if validityMessage && !valid && touched}
  <p class="error-message">{validityMessage}</p>
{/if}

<style>
  .form-control {
    display: flex;
    margin: 10px 0;
  }
  label {
    width: 33%;
  }
  input,
  textarea {
    width: 67%;
    box-shadow: 0 3px 3px 0px #00000042;
    outline: none;
    border: none;
  }
  input:focus,
  textarea:focus {
    box-shadow: 0 3px 3px 0px #cf0056;
  }

  .invalid {
    border-color: red;
    background: #e77f7f;
  }

  .error-message {
    font-size: 12px;
    font-style: italic;
    font-weight: 500;
    color: red;
    margin: 0.25rem 0 1rem 0;
  }
</style>
