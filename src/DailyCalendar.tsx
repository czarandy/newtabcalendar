import {DateTime, Interval} from 'luxon';
import {Event} from './useEvents';
import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import CurrentTime from './CurrentTime';
import useDateTime from './useDateTime';
import Hour from './Hour';
import EventElement from './Event';

const CalendarWrapper = styled.div`
  height: 90px;
  bottom: 15%;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const CalendarDiv = styled.div`
  position: relative;
  min-width: 800px;
  width: calc(100vw - 900px);
`;

const CalendarChevron = styled.button`
  opacity: 0.5;
  &:hover {
    opacity: 0.8;
  }
  position: absolute;
  border: 0;
  background: #0000;
  padding: 0;
  cursor: pointer;
  height: 100%;
  width: 40px;
  filter: var(--black-icon-filter);
`;

const CalendarLeftChevron = styled(CalendarChevron)`
  left: -40px;
`;

const CalendarRightChevron = styled(CalendarChevron)`
  right: -40px;
`;

const CustomDayDiv = styled.div`
  position: absolute;
  top: -20px;
  right: -36px;
`;

const HourCells = styled.div`
  position: absolute;
  font-size: 10px;
  font-weight: 500;
  top: 10px;
  display: flex;
  left: 0;
  right: 0;
  justify-content: space-between;
  border-right: 1px solid var(--border-color);
`;

const CalendarWash = styled.div`
  background-color: var(--overlay-background);
  border-radius: 10px;
  position: absolute;
  left: -40px;
  right: -40px;
  height: 100%;
  top: 0;
  opacity: 0.8;
`;

function _eventsOverlap(e1: Event, e2: Event): boolean {
  return Interval.fromDateTimes(e1.start, e1.end).overlaps(
    Interval.fromDateTimes(e2.start, e2.end),
  );
}

function _packEvents(columns: any[]): any {
  const events: any[] = [];
  columns.forEach((col, row) => {
    col.forEach((event: any) => {
      events.push(
        <EventElement
          key={event.id}
          event={event}
          isFullDay={false}
          top={(row / columns.length) * 45 + (row > 0 ? 1 : 0)}
          height={45 / columns.length - (row < columns.length - 1 ? 1 : 0)}
        />,
      );
    });
  });
  return events;
}

export default function DailyCalendar({
  events: eventsFromProps,
  selectedTime,
  setSelectedTime,
}: {
  events: Event[];
  selectedTime: DateTime;
  setSelectedTime: (dt: DateTime) => unknown;
}): React.ReactElement {
  const isFullDay = false;
  const now = useDateTime();
  const hideCurrentTime = !now.hasSame(selectedTime, 'day');
  const curhour = now.hour;
  const hours = [];
  const startHour = isFullDay ? 0 : 7;
  const endHour = isFullDay ? 24 : 19;
  for (let hour = startHour; hour < endHour; ++hour) {
    hours.push(<Hour key={hour} hourNum={hour} isFuture={hour >= curhour} />);
  }

  let events: any[] = [];
  let lastEventEnd: number | null = null;
  let columns: any[] = [];
  for (const event of eventsFromProps.filter(event =>
    event.start.hasSame(selectedTime, 'day'),
  )) {
    if (lastEventEnd != null && event.start.toMillis() >= lastEventEnd) {
      events = events.concat(_packEvents(columns));
      columns = [];
      lastEventEnd = null;
    }
    let placed = false;
    for (let j = 0; j < columns.length; ++j) {
      const col = columns[j];
      if (!_eventsOverlap(col[col.length - 1], event)) {
        columns[j].push(event);
        placed = true;
        break;
      }
    }
    if (!placed) {
      columns.push([event]);
    }
    if (lastEventEnd == null || event.end.toMillis() > lastEventEnd) {
      lastEventEnd = event.end.toMillis();
    }
  }
  if (columns.length > 0) {
    events = events.concat(_packEvents(columns));
  }
  return (
    <CalendarWrapper>
      <CalendarDiv>
        <CalendarWash />
        <Tippy content="Previous Day">
          <CalendarLeftChevron
            onClick={() => setSelectedTime(selectedTime.minus({days: 1}))}>
            <i className="fas fa-chevron-left" />
          </CalendarLeftChevron>
        </Tippy>
        <Tippy content="Next Day">
          <CalendarRightChevron
            onClick={() => setSelectedTime(selectedTime.plus({days: 1}))}>
            <i className="fas fa-chevron-right" />
          </CalendarRightChevron>
        </Tippy>
        <HourCells>{hours}</HourCells>
        {events}
        {hideCurrentTime ? (
          <CustomDayDiv>
            {selectedTime.toLocaleString({dateStyle: 'full'})}
          </CustomDayDiv>
        ) : (
          <CurrentTime now={now} fullDay={isFullDay} />
        )}
      </CalendarDiv>
    </CalendarWrapper>
  );
}
