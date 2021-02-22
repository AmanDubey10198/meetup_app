<script context="module">
  export function preload(page) {
    const meetupId = page.params.id;
    return this.fetch(
      `https://svelte-course-60fbe-default-rtdb.firebaseio.com/meetups/${meetupId}.json`
    )
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed fetching meetups.");
        }
        return res.json();
      })
      .then(data => {
        return { selectedMeetup: { ...data, id: meetupId } };
      })
      .catch(err => {
        this.error(500, "Couldn't load data");
      });
  }
</script>

<script>
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  import Button from "../components/UI/Button.svelte";

  export let selectedMeetup;
</script>

<section in:fade={{ delay: 200 }}>
  <div class="image">
    <img src={selectedMeetup.imageUrl} alt={selectedMeetup.title} />
  </div>
  <div class="content">
    <h1>{selectedMeetup.title}</h1>
    <h4>{selectedMeetup.subtitle} - {selectedMeetup.address}</h4>
    <p>{selectedMeetup.description}</p>
    <Button href="mailto:{selectedMeetup.contact}">Contact</Button>
    <Button type="button" mode="outline" href="/" on:click>Close</Button>
  </div>
</section>

<style>
  section {
    margin-top: 4rem;
    text-align: center;
  }
  .image {
    width: 100%;
    height: 15rem;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
