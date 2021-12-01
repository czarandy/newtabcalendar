import {DateTime} from 'luxon';
import {useCallback} from 'react';
import fetchFromGoogle from './fetchFromGoogle';
import useCachedData from './useCachedData';

export type Calendar = {
  id: string;
  summary: string;
  backgroundColor: string;
};

async function fetchCalendars(token: string): Promise<Calendar[]> {
  return fetchFromGoogle(
    token,
    'users/me/calendarList',
    new URLSearchParams(),
  ).then(data => data.items);
}

export default function useCalendars(token: string | null): Calendar[] {
  const fetch = useCallback((): Promise<Calendar[]> => {
    if (token != null) {
      return fetchCalendars(token);
    }
    return Promise.resolve([]);
  }, [token]);
  return useCachedData('calendars/gcal/v2', [], fetch);
}
