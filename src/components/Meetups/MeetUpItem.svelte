<script>
  import { createEventDispatcher } from "svelte";
  import { scale } from "svelte/transition";

  import Button from "../UI/Button.svelte";
  import Badge from "../UI/Badge.svelte";
  import meetups from "../../meetups-store";

  const dispatch = createEventDispatcher();
  export let id;
  export let title;
  export let subtitle;
  export let imageUrl;
  export let description;
  export let address;
  export let email;
  export let isFavorite;
  let isLoading = false;

  const toggleFavorite = () => {
    isLoading = true;
    fetch(
      `https://svelte-course-60fbe-default-rtdb.firebaseio.com/meetups/${id}.json`,
      {
        method: "PATCH",
        body: JSON.stringify({
          isFavorite: !isFavorite,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed toggle favorite");
        }
        meetups.toggleFavorite(id);
      })
      .catch(err => console.log(err))
      .finally(() => (isLoading = false));
  };
</script>

<article transition:scale={{ duration: 500 }}>
  <div class="meetup-card">
    <header>
      <h1>
        {title}
        {#if isFavorite}
          <Badge>FAVORITE</Badge>
        {/if}
      </h1>
      <h4>{subtitle}</h4>
      <p>{address}</p>
    </header>
    <main>
      <div class="image">
        <img src={imageUrl} alt="" />
      </div>
      <div class="description">
        {description}
        <div />
      </div>
    </main>
    <footer>
      <Button href="mailto:{email}">Contact</Button>
      <Button href="/{id}">Show Details</Button>
      {#if isLoading}
        <!-- <LoadingSpinner /> -->
        <span>Changing...</span>
      {:else}
        <Button
          color={isFavorite ? null : "success"}
          on:click={toggleFavorite}
          mode="outline">{isFavorite ? "Unfavorite" : "Favorite"}</Button
        >
      {/if}

      <Button on:click={() => dispatch("editDetails", { id })}>Edit</Button>
    </footer>
  </div>
</article>

<style>
  .meetup-card {
    width: 90%;
    /* max-width: 30rem; */
    margin: 2rem auto;
    box-shadow: 0 0 3px 3px #00000042;
    border-radius: 10px;
  }

  h1,
  h4 {
    margin: 0;
  }
  h4 {
    color: #808080;
  }
  header {
    padding: 1rem;
  }
  main {
    margin: 0;
    text-align: right;
    font-size: 12px;
    font-weight: 500;
  }
  .image {
    width: 100%;
    height: 10rem;
  }

  img {
    height: inherit;
    width: 100%;
    object-fit: cover;
  }
  .description {
    height: inherit;
    padding: 1rem;
    background-color: #fafafa;
  }
  footer {
    display: flex;
    justify-content: start;
    align-items: center;
    padding: 1rem;
  }
</style>
