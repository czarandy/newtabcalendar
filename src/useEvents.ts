import {DateTime} from 'luxon';
import {useEffect, useState} from 'react';
import useDateTime from './useDateTime';

export type Event = {
  start: DateTime;
  end: DateTime;
  summary: string;
  description: string;
};

function parseEvent(event: any): Event {
  return {
    start: DateTime.fromISO(event.start.dateTime),
    end: DateTime.fromISO(event.end.dateTime),
    description: event.description,
    summary: event.summary,
  };
}

function setLocalStorage(key: string, value: any): Promise<void> {
  return new Promise(resolve =>
    chrome.storage.local.set({[key]: value}, resolve),
  );
}

function getLocalStorage(key: string): Promise<any> {
  return new Promise(resolve =>
    chrome.storage.local.get([key], result => {
      resolve(result[key]);
    }),
  );
}

const TIMEOUT = 60 * 60;
const KEY = 'events/gcal';

async function fetchEvents(
  token: string,
  start: DateTime,
  end: DateTime,
): Promise<Event[]> {
  return fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?' +
      new URLSearchParams({
        timeMin: start.toISO(),
        timeMax: end.toISO(),
      }),
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  )
    .then(response => response.json())
    .then(data => data.items.map(parseEvent));
}

type CachedValue = {
  dt: DateTime;
  events: Event[];
};

export default function useEvents(token: string | null): Event[] {
  const [cachedValue, setCachedValue] = useState<CachedValue | null>(null);
  const now = useDateTime();
  useEffect(() => {
    async function fetchFromSource() {
      let events: Event[] = [];
      if (token != null) {
        events = await fetchEvents(
          token,
          now.startOf('week'),
          now.endOf('week'),
        );
      }
      const value = {
        dt: now,
        events,
      };
      setCachedValue(value);
      await setLocalStorage(KEY, value);
    }

    (async function () {
      // If no data yet, simply get it from local storage
      if (cachedValue == null) {
        const result = await getLocalStorage(KEY);
        if (!result) {
          await fetchFromSource();
        } else {
          setCachedValue(result);
        }
      }
      // If we do have some data, possibly refetch it if it's old
      if (
        cachedValue != null &&
        now.diff(cachedValue.dt).as('seconds') > TIMEOUT
      ) {
        fetchFromSource();
      }
    })();
  }, [cachedValue, now, token]);
  return cachedValue == null ? [] : cachedValue.events;
}
