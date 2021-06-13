<script context="module">
  export async function load({page}) {
    const url = 'https://meetup-7274c-default-rtdb.firebaseio.com/meetups.json';
    const res = await fetch(url);
    const data = await res.json();
    //console.log(res)
    if (res.status === 200) {
      const loadedMeetups = [];
      for (const key in data) {
        loadedMeetups.push({
          ...data[key],
          id: key
        });
      };
      console.log(res)
      return {
        props: {
          fetchedMeetups: loadedMeetups.reverse()
        }
      };
    };

    // return {
    //   status: res.statusText,
    //   error: new Error('Could not fetch meetups!');
    // }
  }
</script>

<script>
    import meetups from "../meetups-store.js";
    import { createEventDispatcher, onMount, onDestroy } from "svelte";
    import { scale } from "svelte/transition";
    import { flip } from "svelte/animate";

    import MeetupItem from '../components/Meetups/MeetupItem.svelte';
    import MeetupFilter from "../components/Meetups/MeetupFilter.svelte";
    import Button from "../components/UI/Button.svelte";
    import EditMeetup from "../components/Meetups/EditMeetup.svelte";
    import LoadingSpinner from "../components/UI/LoadingSpinner.svelte";

    export let fetchedMeetups;

    let loadedMeetups = [];
    let editMode;
    let editedId;
    let isLoading;
    let unsubscribe;

    const dispatch = createEventDispatcher();

    let favsOnly = false;

    $: filteredMeetups = favsOnly
      ? loadedMeetups.filter((meetup) => meetup.isFavorite)
      : loadedMeetups;

    onMount(() => {
      unsubscribe = meetups.subscribe(items => {
        loadedMeetups = items;
      });
      meetups.setMeetups(fetchedMeetups);
    });

    onDestroy(() => {
      if (unsubscribe) {
        unsubscribe();
      };
    });

    function setFilter(event) {
      favsOnly = event.detail === 1;
    };

    function savedMeetup() {
      editMode = null;
    };

  function cancelEdit() {
    editMode = null;
    editedId = null;
  };

  function editDetails(event) {
    editMode = 'edit';
    editedId = event.detail;
  };

  function startAdd() {
    editMode = "edit";
  };
</script>

<style>
    #meetups {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      grid-gap: 1rem;
    }

    #meetup-controls {
      margin: 1rem;
      display: flex;
      justify-content: space-between;
    }

    #no-meetups {
      margin: 1rem;
    }

    @media (min-width: 768px) {
      #meetups {
          grid-template-columns: repeat(2, 1fr);
      }
    }
</style>

<svelte:head>
  <title>Meetups Page</title>
</svelte:head>

{#if editMode === "edit"}
  <EditMeetup
    id={editedId}
    on:save={savedMeetup}
    on:cancel={cancelEdit}
  />
{/if}
{#if isLoading}
  <LoadingSpinner />
{:else}
<section id="meetup-controls">
  <MeetupFilter on:select={setFilter} />
  <Button
    on:click="{startAdd}">
    New Meetup
  </Button>
</section>
{#if filteredMeetups.length === 0}
  <p id="no-meetups">No meetups found, you can start adding some.</p>
{/if}
<section id="meetups">
  {#each filteredMeetups as meetup (meetup.id)}
    <div transition:scale animate:flip={{duration: 300}}>
      <MeetupItem
        id={meetup.id}
        title={meetup.title}
        subtitle={meetup.subtitle}
        imageUrl={meetup.imageUrl}
        description={meetup.description}
        address={meetup.address}
        isFav={meetup.isFavorite}
        email={meetup.contactEmail}
        on:edit={editDetails}
      />
    </div>
  {/each}
</section>
{/if}
