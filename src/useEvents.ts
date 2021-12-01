import {DateTime} from 'luxon';
import {useCallback, useEffect, useState} from 'react';
import fetchFromGoogle from './fetchFromGoogle';
import useCachedData from './useCachedData';
import {Calendar} from './useCalendars';
import hash from 'object-hash';

export type Event = {
  id: string;
  calendarID: string;
  backgroundColor: string;
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
    calendarID: event.calendarID,
    backgroundColor: event.backgroundColor,
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
      singleEvents: 'true',
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
          ).then(events =>
            (events ?? []).map(event => ({
              ...event,
              calendarID: calendar.id,
              backgroundColor: calendar.backgroundColor,
            })),
          ),
        ),
      ).then(result => result.flat().filter(Boolean));
    }
    return Promise.resolve([]);
  }, [token, calendars, selectedTime]);
  const data = useCachedData(
    'events/gcal/v5/' +
      hash({
        st: selectedTime.startOf('day').toMillis(),
        calendars: calendars.map(cal => cal.id),
      }),
    [],
    fetch,
  );
  return data
    .map(parseEvent)
    .filter((x): x is Event => x != null)
    .sort((a, b) => a.start.toMillis() - b.start.toMillis());
}
