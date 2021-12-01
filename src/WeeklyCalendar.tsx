import {DateTime, Info} from 'luxon';
import React from 'react';
import styled from 'styled-components';
import EventPopover from './EventPopover';
import useDateTime from './useDateTime';
import type {Event} from './useEvents';
import Tippy from '@tippyjs/react';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 14%);
  min-width: 60vw;
  max-width: 80vw;
`;

const Day = styled.div<{isSelected: boolean}>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${props =>
    props.isSelected ? 'rgba(0,0,0,0.07)' : 'transparent'};
`;

const DayEvent = styled.div`
  margin-bottom: 4px;
`;

const DayEventTime = styled.div`
  color: var(--secondary-color);
`;

const DayHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;
`;

const EventLink = styled.a`
  color: var(--primary-color);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  word-break: break-word;
`;

const DAYS = Info.weekdays();

export default function WeeklyCalendar({
  events,
  selectedTime,
  setSelectedTime,
}: {
  events: Event[];
  selectedTime: DateTime;
  setSelectedTime: (dt: DateTime) => unknown;
}): React.ReactElement {
  const now = useDateTime();
  return (
    <Wrapper>
      {DAYS.map((day, idx) => {
        const dayEvents = events.filter(
          event => event.start.weekday === idx + 1,
        );
        const allDayEvents = dayEvents.filter(e => e.isAllDay);
        const regularEvents = dayEvents.filter(e => !e.isAllDay);
        return (
          <Day key={day} isSelected={now.weekday === idx + 1}>
            <DayHeader>{day}</DayHeader>
            {allDayEvents.length > 0 ? (
              <>
                <DayEventTime>All Day</DayEventTime>
                {allDayEvents.map(event => (
                  <DayEvent key={event.id}>
                    <Tippy
                      className="tippy-reset"
                      content={<EventPopover event={event} />}
                      placement="top"
                      interactive={true}>
                      <EventLink href={event.url}>{event.summary}</EventLink>
                    </Tippy>
                  </DayEvent>
                ))}
              </>
            ) : null}
            {regularEvents.map(event => (
              <DayEvent key={event.id}>
                <DayEventTime>
                  {event.start.toLocaleString(DateTime.TIME_SIMPLE)}
                  {' - '}
                  {event.end.toLocaleString(DateTime.TIME_SIMPLE)}
                </DayEventTime>{' '}
                <Tippy
                  className="tippy-reset"
                  content={<EventPopover event={event} />}
                  placement="top"
                  interactive={true}>
                  <EventLink href={event.url}> {event.summary}</EventLink>
                </Tippy>
              </DayEvent>
            ))}
          </Day>
        );
      })}
    </Wrapper>
  );
}
