import { CalendarEvent } from '@/@fake-db/types';
import type { Except } from 'type-fest';

export interface Event extends CalendarEvent {
  id: number
}

export type NewEvent = Except<Event, 'id'>
