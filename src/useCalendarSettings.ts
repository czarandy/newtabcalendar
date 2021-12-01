import useSyncedState from './useSyncedState';

type CalendarSettings = {
  enabled: boolean;
  mode: 'weekly' | 'daily';
  disabledCalendars: string[];
};

const DEFAULT: CalendarSettings = {
  enabled: true,
  mode: 'weekly',
  disabledCalendars: [],
};

export function useCalendarSettings(): [
  CalendarSettings,
  (newValue: CalendarSettings) => unknown,
] {
  return useSyncedState<CalendarSettings>('settings/calendar/v1', DEFAULT);
}
