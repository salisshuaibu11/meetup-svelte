<script>
    import meetups from "../../meetups-store";
    import { createEventDispatcher } from 'svelte';
    import TextInput from "../UI/TextInput.svelte";
    import Button from "../UI/Button.svelte";
    import Modal from "../UI/Modal.svelte";
    import { isEmpty, isValidEmail } from "../../helpers/validation";

    export let id = null;

    let title = "";
	  let subtitle = "";
	  let address = "";
	  let email = "";
	  let description = "";
	  let imageUrl = "";

    let formIsValid = false;

    if (id) {
        const unsubscribe = meetups.subscribe(items => {
            const selectedMeetups = items.find(item => item.id === id);
            title = selectedMeetups.title;
            subtitle = selectedMeetups.subtitle;
            address = selectedMeetups.address;
            email = selectedMeetups.email;
            description = selectedMeetups.description;
            imageUrl = selectedMeetups.imageUrl;
        });

        unsubscribe();
    }

    const dispatch = createEventDispatcher();

    $: titleValid = !isEmpty(title);
    $: subtitleValid = !isEmpty(subtitle);
    $: addressValid = !isEmpty(address);
    $: emailValid = !isValidEmail(email);
    $: descriptionValid = !isEmpty(description);
    $: imageUrlValid = !isEmpty(imageUrl);
    $: formIsValid = titleValid && subtitleValid && addressValid && descriptionValid && imageUrlValid && emailValid;

    function submitForm() {
        const meetupData = {
    			title: title,
    			subtitle: subtitle,
    			description: description,
    			imageUrl: imageUrl,
    			contactEmail: email,
    			address: address
		    };

        if (id) {
          fetch(`https://meetup-7274c-default-rtdb.firebaseio.com/meetups/${id}.json`, {
            method: 'PATCH',
            body: JSON.stringify(meetupData),
            headers: { "Content-Type": "application/json" }
          })
          .then(res => {
              if (!res.ok) {
                throw new Error('An error occured, please try again!');
              }
              meetups.updateMeetup(id, meetupData);
          })
          .catch(err => console.log(err));
        } else {
           fetch('https://meetup-7274c-default-rtdb.firebaseio.com/meetups.json', {
             method: 'POST',
             body: JSON.stringify({...meetupData, isFavorite: false}),
             headers: {'Content-Type': 'application/json'}
           }).then(res => {
             if (!res.ok) {
               throw new Error('An error occured, please try again!');
             }
             return res.json();
           })
           .then(data => {
              meetups.addMeetup({...meetupData, isFavorite: false, id: data.name});
           })
           .catch(err => {
             console.log(err);
           })
        }
        dispatch('save');
    };

    function cancel(){
      dispatch('cancel');
    };

    function deleteMeetup() {
      fetch(`https://meetup-7274c-default-rtdb.firebaseio.com/meetups/${id}.json`, {
        method: 'DELETE'
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('An error occured while deleting try again!');
        };
        meetups.removeMeetup(id);
      })
      .catch(err => {
        console.log(err);
      });
      dispatch('save');
    };
</script>

<style>
    form {
	    width: 30rem;
		max-width: 90%;
		margin: auto;
	}
</style>

<Modal title="Edit Meetup Data" on:cancel>
    <form on:submit|preventDefault={submitForm} on:>
        <TextInput
            id="title"
            label="Title"
            valid={titleValid}
            validityMessage="Please fill in the input field"
            value={title}
            on:input="{event => {title = event.target.value}}"
        />
        <TextInput
            id="subtitle"
            label="Subtitle"
            valid={subtitleValid}
            validityMessage="Please fill in the input field"
            value={subtitle}
            on:input="{event => {subtitle = event.target.value}}"
        />
        <TextInput
            id="address"
            valid={addressValid}
            validityMessage="Please fill in the input field"
            label="Address"
            value={address}
            on:input="{event => {address = event.target.value}}"
        />
        <TextInput
            id="imageUrl"
            valid={imageUrlValid}
            validityMessage="Please fill in the input field"
            label="Image URL"
            value={imageUrl}
            on:input="{event => {imageUrl = event.target.value}}"
        />
        <TextInput
            id="email"
            valid={emailValid}
            validityMessage="Please fill in the input field"
            label="Email"
            type="email"
            value={email}
            on:input="{event => {email = event.target.value}}"
        />
        <TextInput
            id="description"
            valid={descriptionValid}
            validityMessage="Please fill in the input field"
            label="Description"
            controlType="textarea"
            rows="3"
            bind:value={description}
        />
    </form>
    <div slot="footer">
      <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
      <Button disabled={!formIsValid} type="submit" on:click={submitForm}>Save</Button>
      {#if id}
      <Button type="button" on:click={deleteMeetup}>Delete</Button>
      {/if}
    </div>
</Modal>
