<script context="module">
  export async function load({ page }) {
    const meetupId = page.params.id;
    const url = `https://meetup-7274c-default-rtdb.firebaseio.com/meetups/${meetupId}.json`;
    const res = await fetch(url);
    const data = await res.json();

    if (res.status === 200) {
      return {
        props: {
          loadedMeetup: {...data, id: meetupId}
        }
      }
    };

    // return {
    //   status: res.statusText,
    //   error: new Error('Could not fetch meetups!');
    // }
  };
</script>

<script>
    import { onDestroy, createEventDispatcher } from "svelte";
    import meetups from "../meetups-store";
    import Button from "../components/UI/Button.svelte";

    export let loadedMeetup = [];
</script>

<style>
  section {
    margin-top: 4rem;
  }

.image {
  width: 100%;
  height: 25rem;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image {
  background: #e7e7e7;
}

.content {
  text-align: center;
  width: 80%;
  margin: auto;
}

h1 {
  font-size: 2rem;
  font-family: 'Roboto Slab', sans-serif;
  margin: 0.5rem 0;
}

h2 {
  font-size: 1.25rem;
  color: #6b6b6b;
}

p {
  font-size: 1.5rem;
}
</style>

<section>
    <div class="image">
        <img src="{loadedMeetup.img}" alt="{loadedMeetup.title}" />
    </div>
    <div class="content">
        <h1>{loadedMeetup.title}</h1>
        <h2>{loadedMeetup.subtitle} - {loadedMeetup.address}</h2>
        <p>{loadedMeetup.description}</p>
        <Button href="mailto:{loadedMeetup.contactEmail}">Contact</Button>
        <Button mode="outline" href="/">Close</Button>
    </div>
</section>
