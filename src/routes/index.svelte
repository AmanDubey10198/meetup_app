<script context="module">
  export function preload(page) {
    return this.fetch(
      "https://svelte-course-60fbe-default-rtdb.firebaseio.com/meetups.json"
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed fetching meetups.");
        }
        return res.json();
      })
      .then(data => {
        const meetupsList = [];
        for (const keys in data) {
          meetupsList.push({ ...data[keys], id: keys });
        }
        return { fetchedMeetups: meetupsList };
        // return setTimeout(() => {
        //   isLoading = false;
        //   meetups.setMeetup(meetupsList.reverse());
        // }, 1000);
      })
      .catch(err => {
        isLoading = false;
        error = err;
        this.error(500, "Could not fetch meetups");
      });
  }
</script>

<script>
  // importing files
  import { onDestroy, onMount } from "svelte";
  import { flip } from "svelte/animate";

  import EditMeetUps from "../components/Meetups/EditMeetups.svelte";
  import LoadingSpinner from "../components/UI/LoadingSpinner.svelte";
  import Error from "../components/UI/Error.svelte";

  import Button from "../components/UI/Button.svelte";
  import MeetupFilter from "../components/Meetups/MeetupFilter.svelte";
  import MeetUpItem from "../components/Meetups/MeetUpItem.svelte";

  import meetups from "../meetups-store";

  // variables declaration
  let unsubscribe;

  let editMode;
  let editId = null;
  let page = "overview";
  let pageData = {};
  let isLoading = false;
  let error;

  let favsOnly = false;

  export let fetchedMeetups;

  // populate our local store on mount
  onMount(() => {
    meetups.setMeetup(fetchedMeetups);
    unsubscribe = meetups.subscribe(items => (fetchedMeetups = items));
  });

  // unsubscribe from store on Destroy
  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  // dependent variable
  $: filteredMeetups = favsOnly
    ? fetchedMeetups.filter(m => m.isFavorite)
    : fetchedMeetups;

  //open modal in edit mode if id
  const editDetails = e => {
    editMode = "edit";
    editId = e?.detail?.id;
  };

  // close Modals for edit
  const closeModal = e => {
    editMode = null;
    editId = null;
  };

  // delte from the meetups
  const onDelete = e => {
    fetch(
      `https://svelte-course-60fbe-default-rtdb.firebaseio.com/meetups/${e.detail.id}.json`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Delete Failed");
        }
        meetups.deleteMeetup(e.detail.id);
        editMode = null;
        editId = null;
      })
      .catch(err => (error = err));
  };

  // set filter from all or favorites
  const setFilter = event => {
    favsOnly = parseInt(event.detail) === 1;
  };
</script>

<svelte:head>
  <title>Meet ups</title>
</svelte:head>

{#if error}
  <Error message={error.message} on:close-modal={() => (error = null)} />
{/if}
<main>
  {#if editMode === "edit"}
    <EditMeetUps
      id={editId}
      on:save={closeModal}
      on:close-modal={closeModal}
      on:delete={onDelete}
    />
  {/if}

  {#if isLoading}
    <LoadingSpinner />
  {:else}
    <section id="meetup-controls">
      <MeetupFilter on:select={setFilter} />
      <Button on:click={() => editDetails()}>New Meetup</Button>
    </section>
    {#if filteredMeetups.length === 0}
      <p id="no-meetups">No meetups found you can start adding one.</p>
    {:else}
      <section id="meetups">
        {#each filteredMeetups as meetup (meetup.id)}
          <div animate:flip={{ duration: 500 }}>
            <MeetUpItem {...meetup} on:editDetails={editDetails} />
          </div>
        {/each}
      </section>
    {/if}
  {/if}
</main>

<style>
  #meetup-controls {
    margin: 1rem;
    display: flex;
    justify-content: space-between;
  }
  #meetups {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
    grid-gap: 1rem;
  }

  @media (min-width: 768px) {
    #meetups {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  #no-meetups {
    margin: 1rem;
  }
</style>
