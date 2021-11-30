import React from 'react';
import Button from './Button';
import useAuthToken from './useAuthToken';
import useEvents from './useEvents';
import WeeklyCalendar from './WeeklyCalendar';

export default function Calendar(): JSX.Element | null {
  const [tokenResult, updateToken] = useAuthToken();
  const events = useEvents(tokenResult.token);
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
  if (true) {
    return <WeeklyCalendar events={events} />;
  }
  return null;
}

/*
import Event from './Event.js';
import {getLeftPercent} from './calendarPosition.js';
import useStateWithSyncStorage from './useStateWithSyncStorage.js';
import {storageKeys, DEFAULT_24_HOUR} from './LocalStorage.js';
import classNames from 'classnames';
import styled, {css} from 'styled-components';
import Tippy from '@tippyjs/react';
import getDayLabel from './getDayLabel.js';

const CalendarDiv = styled.div`
  position: relative;
  min-width: 800px;
  ${props =>
    props.fullDay
      ? css`
          width: calc(100vw - 700px);
        `
      : css`
          width: calc(100vw - 900px);
        `};
`;

const CustomDayDiv = styled.div`
  position: absolute;
  top: -20px;
  right: -36px;
`;

function Hour(props) {
  const [use24Hour] = useStateWithSyncStorage(
    storageKeys.use24Hour,
    DEFAULT_24_HOUR
  );
  let hour = props.hour;
  if (hour != null) {
    if (use24Hour) {
      if (hour < 10) {
        hour = '0' + hour;
      }
      hour = hour + ':00';
    } else if (hour === 0) {
      hour = '12 AM';
    } else if (hour === 12) {
      hour = '12 PM';
    } else if (hour > 12) {
      hour = hour - 12 + ' PM';
    } else {
      hour = hour + ' AM';
    }
  }
  return (
    <div className="hourCell">
      <div className="divider" />
      {hour != null ? (
        <div
          className={classNames({
            hour: true,
            primaryColor: props.isFuture,
            secondaryColor: !props.isFuture,
          })}>
          {hour}
        </div>
      ) : null}
    </div>
  );
}

function CurrentTime(props) {
  const left = getLeftPercent(props.now, props.fullDay);
  if (left <= 0 || left >= 100) {
    return null;
  }
  return (
    <>
      <div className="currentTimeBall" style={{left: left + '%'}} />
      <div className="currentTime" style={{left: left + '%'}} />
    </>
  );
}

function eventsOverlap(e1, e2) {
  return e1.end_time > e2.start_time && e1.start_time < e2.end_time;
}

function _packEvents(columns) {
  const events = [];
  columns.forEach((col, row) => {
    col.forEach(event => {
      events.push(
        <Event
          key={event.id}
          event={event}
          top={(row / columns.length) * 45 + (row > 0 ? 1 : 0)}
          height={45 / columns.length - (row < columns.length - 1 ? 1 : 0)}
        />
      );
    });
  });
  return events;
}

function Calendar(props) {
  const [calendarEnabled] = useStateWithSyncStorage(storageKeys.calendar, true);
  const [calendarFullDay] = useStateWithSyncStorage(
    storageKeys.calendarFullDay,
    false
  );
  if (!calendarEnabled) {
    return null;
  }

  const now = props.now;
  const curhour = now.getHours();
  const hours = [];
  const startHour = calendarFullDay ? 0 : 7;
  const endHour = calendarFullDay ? 24 : 19;
  for (let hour = startHour; hour < endHour; ++hour) {
    hours.push(<Hour key={hour} hour={hour} isFuture={hour >= curhour} />);
  }

  let events = [];
  let lastEventEnd = null;
  let columns = [];
  for (let i = 0; i < props.events.length; ++i) {
    const event = props.events[i];
    if (lastEventEnd != null && event.start_time >= lastEventEnd) {
      events = events.concat(_packEvents(columns));
      columns = [];
      lastEventEnd = null;
    }
    let placed = false;
    for (let j = 0; j < columns.length; ++j) {
      const col = columns[j];
      if (!eventsOverlap(col[col.length - 1], event)) {
        columns[j].push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
    }
    if (lastEventEnd == null || event.end_time > lastEventEnd) {
      lastEventEnd = event.end_time;
    }
  }
  if (columns.length > 0) {
    events = events.concat(_packEvents(columns));
  }

  return (
    <div className="calendarWrapper">
      <CalendarDiv fullDay={calendarFullDay}>
        <div className="calendarWash overlayBackground" />
        <Tippy content="Previous Day">
          <button
            className="calendarChevron calendarLeftChevron"
            onClick={props.onPrevious}>
            <img src="chevron-left.png" className="icon" alt="Previous Day" />
          </button>
        </Tippy>
        <Tippy content="Next Day">
          <button
            className="calendarChevron calendarRightChevron"
            onClick={props.onNext}>
            <img src="chevron-right.png" className="icon" alt="Next Day" />
          </button>
        </Tippy>
        <div className="hourCells borderColor">{hours}</div>
        {events}
        {props.hideCurrentTime ? (
          <CustomDayDiv>{getDayLabel(props.customNow)}</CustomDayDiv>
        ) : (
          <CurrentTime now={now} fullDay={calendarFullDay} />
        )}
      </CalendarDiv>
    </div>
  );
}

export default Calendar;
*/
