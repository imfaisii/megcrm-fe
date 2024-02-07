import axios from 'axios'
import type { Event, NewEvent } from './types'
import useApiFetch from '@/composables/useApiFetch'

export const useCalendarStore = defineStore('calendar', {
  // arrow function recommended for full type inference
  state: () => ({
    availableCalendars: [
      {
        color: 'error',
        label: 'Personal',
      },
      {
        color: 'primary',
        label: 'Business',
      },
      {
        color: 'success',
        label: 'Holiday',
      },
    ],
    selectedCalendars: ['Personal', 'Business', 'Holiday'],
  }),
  actions: {
    async fetchEvents() {
      return useApiFetch('/calendar/events', { params: { calendars: this.selectedCalendars.join(',') } })
    },
    async addEvent(event: NewEvent) {
      return axios.post('/calendar/events', { event })
    },
    async updateEvent(event: Event) {
      return axios.post(`/calendar/events/${event.id}`, { event })
    },
    async removeEvent(eventId: string) {
      return axios.delete(`/calendar/events/${eventId}`)
    },

  },
})
