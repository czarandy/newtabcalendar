import {DateTime} from 'luxon';
import {useState} from 'react';
import Button from './Button';
import DailyCalendar from './DailyCalendar';
import useAuthToken from './useAuthToken';
import useCalendars from './useCalendars';
import {useCalendarSettings} from './useCalendarSettings';
import useEvents from './useEvents';
import WeeklyCalendar from './WeeklyCalendar';

export default function Calendar(): JSX.Element | null {
  const [calendarSettings, _] = useCalendarSettings();
  const [selectedTime, setSelectedTime] = useState<DateTime>(DateTime.now());
  const [tokenResult, updateToken] = useAuthToken();
  const calendars = useCalendars(tokenResult.token).filter(
    cal => !calendarSettings.disabledCalendars.includes(cal.id),
  );
  const events = useEvents(tokenResult.token, calendars, selectedTime);
  if (!calendarSettings.enabled) {
    return null;
  }
  if (tokenResult.status === 'pending') {
    return null;
  }
  if (tokenResult.token == null) {
    return (
      <Button
        onClick={() =>
          chrome.identity.getAuthToken({interactive: true}, updateToken)
        }>
        Connect To Google Calendar
      </Button>
    );
  }
  if (calendars.length == 0) {
    return null;
  }
  if (calendarSettings.mode === 'weekly') {
    return (
      <WeeklyCalendar
        events={events}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
      />
    );
  }
  return (
    <DailyCalendar
      events={events}
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
    />
  );
}
