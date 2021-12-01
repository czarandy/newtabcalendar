import {getLeft, getRight} from './CalendarPosition';
import EventPopover from './EventPopover';
import Tippy from '@tippyjs/react';
import {Event} from './useEvents';
import styled from 'styled-components';

const EventDiv = styled.div`
  position: absolute;
  height: 40px;
  top: 30px;
  background: #3a5aa1;
  border-radius: 5px;
  opacity: 0.8;
  box-sizing: border-box;
  margin: 1px;
  opacity: 0.8;
  &:hover {
    border: 1px solid #ffffff80;
    opacity: 1;
  }
`;

export default function EventElement({
  event,
  isFullDay,
  top,
  height,
}: {
  event: Event;
  isFullDay: boolean;
  top: number;
  height: number;
}) {
  const left = event.isAllDay ? 0 : getLeft(event.start, isFullDay);
  const right = event.isAllDay ? 0 : getRight(event.end, isFullDay);
  return (
    <Tippy
      className="tippy-reset"
      content={<EventPopover event={event} />}
      placement="top"
      interactive={true}>
      <EventDiv
        style={{
          left,
          right,
          top: top + 30 + 'px',
          height: height + 'px',
          backgroundColor: event.backgroundColor,
        }}
      />
    </Tippy>
  );
}
