import useSyncedState from './useSyncedState';

type CalendarSettings = {
  mode: 'disabled' | 'weekly' | 'daily';
  disabledCalendars: string[];
};

const DEFAULT: CalendarSettings = {
  mode: 'weekly',
  disabledCalendars: [],
};

export function useCalendarSettings(): [
  CalendarSettings,
  (newValue: CalendarSettings) => unknown,
] {
  return useSyncedState<CalendarSettings>('settings/calendar/v1', DEFAULT);
}
