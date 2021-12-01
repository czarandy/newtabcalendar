import {DateTime} from 'luxon';
import {useCallback, useEffect, useState} from 'react';
import fetchFromGoogle from './fetchFromGoogle';
import useCachedData from './useCachedData';
import {Calendar} from './useCalendars';

export type Event = {
  id: string;
  start: DateTime;
  end: DateTime;
  summary: string;
  description: string;
  url: string;
  isAllDay: boolean;
};

function parseEvent(event: any): Event | null {
  if (event.status === 'cancelled' || !event.start || !event.end) {
    return null;
  }
  const isAllDay = event.start.date != null;
  return {
    id: event.id,
    start: DateTime.fromISO(event.start.dateTime ?? event.start.date),
    end: DateTime.fromISO(event.end.dateTime ?? event.end.date),
    description: event.description,
    summary: event.summary,
    url: event.htmlLink,
    isAllDay,
  };
}

async function fetchEvents(
  token: string,
  calendar: Calendar,
  start: DateTime,
  end: DateTime,
): Promise<Event[]> {
  return fetchFromGoogle(
    token,
    'calendars/' + calendar.id + '/events',
    new URLSearchParams({
      timeMin: start.toISO(),
      timeMax: end.toISO(),
    }),
  ).then(data => data.items);
}

export default function useEvents(
  token: string | null,
  calendars: Calendar[],
  selectedTime: DateTime,
): Event[] {
  const fetch = useCallback((): Promise<Event[]> => {
    if (token != null) {
      return Promise.all(
        calendars.map(calendar =>
          fetchEvents(
            token,
            calendar,
            selectedTime.startOf('week'),
            selectedTime.endOf('week'),
          ),
        ),
      ).then(result => result.flat().filter(Boolean));
    }
    return Promise.resolve([]);
  }, [token, calendars, selectedTime]);
  const data = useCachedData('events/gcal/v12', [], fetch);
  return data
    .map(parseEvent)
    .filter((x): x is Event => x !== null)
    .sort((a, b) => a.start.toMillis() - b.start.toMillis());
}
