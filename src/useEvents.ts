import ical from 'ical.js';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import useDateTime from './useDateTime';

function parseEvent(event: any): Event | null {
  const [type, props] = event;
  if (type !== 'vevent') {
    return null;
  }
  const result: any = {};
  for (const prop of props) {
    const [key, _, _type, value] = prop;
    switch (key) {
      case 'dtstart':
        result.start = DateTime.fromISO(value);
        break;
      case 'dtend':
        result.end = DateTime.fromISO(value);
        break;
      case 'description':
        result.description = value;
        break;
      case 'summary':
        result.summary = value;
        break;
      case 'location':
        result.location = value;
        break;
    }
  }
  return result;
}

function setLocalStorage(key: string, value: any): Promise<void> {
  return new Promise(resolve => chrome.storage.local.set({ key: value }, resolve));
}

function getLocalStorage(key: string): Promise<any> {
  return new Promise(resolve => chrome.storage.local.get([key], result => {
    resolve(result[key]);
  }));
}


const TIMEOUT = 60 * 60;
const KEY = 'events/ical';

async function fetchEvents() {
  const data = await fetch(
    'https://calendar.google.com/calendar/ical/andy.goder%40gmail.com/private-bf8ba20f1c2fe22da6884d7270bfecd5/basic.ics',
  );
  const body = await data.text();
  const parsed = ical.parse(body);
  return parsed[2].map(parseEvent).filter(Boolean);
}

type Event = {
  start: DateTime,
  end: DateTime,
  summary: string,
  description: string,
  location: string,
};

type CachedValue = {
  dt: DateTime,
  events: Event[],
};

export default function useEvents(): Event[] {
  const [cachedValue, setCachedValue] = useState<CachedValue | null>(null);
  const now = useDateTime();
  useEffect(() => {
    async function fetchFromSource() {
      const events = await fetchEvents();
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
      if (cachedValue != null && now.diff(cachedValue.dt).as('seconds') > TIMEOUT) {
        fetchFromSource();
      }
    })();
  }, [cachedValue, now]);
  return cachedValue == null ? [] : cachedValue.events;
}