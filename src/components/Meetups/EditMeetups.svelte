<script>
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isValidEmail } from "../../helpers/validation";
  import meetups from "../../meetups-store";

  const dispatch = createEventDispatcher();

  export let id = null;

  let title = "";
  let subtitle = "";
  let description = "";
  let address = "";
  let imageUrl = "";
  let email = "";
  let isFavorite = false;
  let formIsValid = false;
  let error;

  if (id) {
    const unsubscribe = meetups.subscribe(items => {
      const selectedMeetup = items.find(item => item.id === id);
      title = selectedMeetup.title;
      subtitle = selectedMeetup.subtitle;
      description = selectedMeetup.description;
      address = selectedMeetup.address;
      imageUrl = selectedMeetup.imageUrl;
      email = selectedMeetup.email;
      isFavorite = selectedMeetup.isFavorite;
    });

    unsubscribe();
  }

  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: descriptionValid = !isEmpty(description);
  $: addressValid = !isEmpty(address);
  $: imageUrlValid = !isEmpty(imageUrl);
  $: emailValid = isValidEmail(email);

  $: formIsValid =
    titleValid &&
    subtitleValid &&
    descriptionValid &&
    addressValid &&
    imageUrlValid &&
    emailValid;

  const submitForm = e => {
    const newMeetUp = {
      email,
      title,
      subtitle,
      address,
      imageUrl,
      description,
      isFavorite,
    };
    if (id) {
      fetch(
        `https://svelte-course-60fbe-default-rtdb.firebaseio.com/meetups/${id}.json`,
        {
          method: "PATCH",
          body: JSON.stringify(newMeetUp),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then(res => {
          if (!res.ok) {
            throw new Error("Falied updated");
          }
          return res.json();
        })
        .then(data => meetups.updateMeetup(id, newMeetUp))
        .catch(err => (error = err));
    } else {
      fetch(
        "https://svelte-course-60fbe-default-rtdb.firebaseio.com/meetups.json",
        {
          method: "POST",
          body: JSON.stringify(newMeetUp),
          headers: { "Content-Type": "application/json" },
        }
      )
        .then(res => {
          if (!res.ok) {
            throw new Error("An error occurred!");
          }
          return res.json();
        })
        .then(data => {
          meetups.addMeetup({ ...newMeetUp, id: data.name });
        })
        .catch(err => (error = err));
    }
    dispatch("save");
  };
</script>

<Modal title="Add Meetup Data" on:close-modal>
  <hr />
  <form on:submit|preventDefault={submitForm}>
    <TextInput
      id="title"
      valid={titleValid}
      validityMessage={"Please enter a valid title"}
      label={"Title"}
      bind:value={title}
    />
    <TextInput
      id="subtitle"
      bind:value={subtitle}
      valid={subtitleValid}
      validityMessage={"Please enter a valid subtitle"}
      label={"Subtitle"}
    />
    <TextInput
      id="address"
      bind:value={address}
      valid={addressValid}
      validityMessage={"Please enter a valid address"}
      label={"Address"}
    />
    <TextInput
      id="imageUrl"
      bind:value={imageUrl}
      valid={imageUrlValid}
      validityMessage={"Please enter a valid imageUrl"}
      label={"Image Url"}
    />
    <TextInput
      id="email"
      bind:value={email}
      valid={emailValid}
      validityMessage={"Please enter a valid email"}
      label="Email"
    />

    <TextInput
      id="description"
      rows="3"
      controlType="textarea"
      valid={descriptionValid}
      validityMessage={"Please enter a valid description"}
      label="Description"
      bind:value={description}
    />
  </form>

  <div slot="footer">
    <Button on:click={submitForm} disabled={!formIsValid}>Save</Button>
    <Button on:click={() => dispatch("close-modal")}>Close</Button>
    {#if id}
      <Button on:click={() => dispatch("delete", { id })}>Delete</Button>
    {/if}
  </div>
</Modal>

<style>
  form {
    width: 90%;
    padding: 1rem;
    border-radius: 10px;
    background-color: #fafafa;
  }
</style>
