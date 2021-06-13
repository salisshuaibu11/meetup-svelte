import { writable } from "svelte/store";

const meetups = writable([
]);

const customMeetupsStore = {
  subscribe: meetups.subscribe,
  setMeetups: (meetupsArray) => {
    meetups.set(meetupsArray);
  },
  addMeetup: (meetupData) => {
    const newMeetup = {
      ...meetupData,
    };
    meetups.update((items) => {
      return [newMeetup, ...items];
    });
  },
  removeMeetup: (id) => {
    meetups.update((items) => {
      return items.filter((item) => item.id !== id);
    });
  },
  updateMeetup: (id, meetupData) => {
    meetups.update((items) => {
      const meetupIndex = items.findIndex((item) => item.id === id);
      const updatedMeetup = { ...items[meetupIndex], ...meetupData };
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  toggleFavorite: (id) => {
    meetups.update((items) => {
      const updatedMeetup = { ...items.find((m) => m.id === id) };
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const meetupIndex = items.findIndex((m) => m.id === id);
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
};

export default customMeetupsStore;
