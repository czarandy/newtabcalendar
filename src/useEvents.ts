import {useCallback} from 'react';

import {Calendar} from './useCalendars';
import {DateTime} from 'luxon';
import fetchFromGoogle from './fetchFromGoogle';
import hash from 'object-hash';
import useCachedData from './useCachedData';
import useColors, {Color} from './useColors';

export type Event = {
  id: string;
  calendarID: string;
  backgroundColor: string;
  start: DateTime;
  end: DateTime;
  summary: string;
  description: string;
  location: string;
  url: string;
  isAllDay: boolean;
  colorID?: string;
  conferenceData?: {
    name: string;
    iconURL: string;
    url: string;
  };
};

function parseEvent(event: any, colors: Map<string, Color>): Event | null {
  if (event.status === 'cancelled' || !event.start || !event.end) {
    return null;
  }
  const isAllDay = event.start.date != null;
  let {conferenceData} = event;
  if (conferenceData) {
    const name = conferenceData.conferenceSolution?.name;
    const iconURL = conferenceData.conferenceSolution?.iconUri;
    const url = conferenceData.entryPoints?.[0].uri;
    if (name && iconURL && url) {
      conferenceData = {
        name,
        url,
        iconURL,
      };
    }
  }
  return {
    id: event.id,
    calendarID: event.calendarID,
    backgroundColor:
      (event.colorId ? colors.get(event.colorId)?.background : null) ??
      event.backgroundColor,
    location: event.location ?? '',
    start: DateTime.fromISO(event.start.dateTime ?? event.start.date),
    end: DateTime.fromISO(event.end.dateTime ?? event.end.date).plus({
      days: isAllDay ? -1 : 0,
    }),
    description: event.description ?? '',
    summary: event.summary,
    url: event.htmlLink,
    isAllDay,
    conferenceData,
    colorID: event.colorId,
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
  const colors = useColors(token);
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
    'events/gcal/v7/' +
      hash({
        st: selectedTime.startOf('day').toMillis(),
        calendars: calendars.map(cal => cal.id),
        token,
      }),
    [],
    fetch,
  );
  return data
    .map(e => parseEvent(e, colors))
    .filter((x): x is Event => x != null)
    .sort((a, b) => a.start.toMillis() - b.start.toMillis());
}
