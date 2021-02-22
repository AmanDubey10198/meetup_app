import { writable } from "svelte/store";

const meetups = writable([]);

const customMeetupStore = {
  subscribe: meetups.subscribe,
  setMeetup: meetupsList => {
    meetups.set([...meetupsList]);
  },
  addMeetup: meetupData => {
    meetups.update(items => [
      {
        ...meetupData,
      },
      ...items,
    ]);
  },
  toggleFavorite: id => {
    meetups.update(items => {
      const updatedMeetup = { ...items.find(ele => ele.id == id) };
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const meetupIndex = items.findIndex(m => m.id === id);
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  updateMeetup: (id, data) => {
    meetups.update(items => {
      const updatedMeetup = [...items];
      const meetupIndex = updatedMeetup.findIndex(item => item.id === id);
      updatedMeetup[meetupIndex] = { id, ...data };
      return updatedMeetup;
    });
  },
  deleteMeetup: id => {
    meetups.update(items => items.filter(item => item.id !== id));
  },
};

export default customMeetupStore;
