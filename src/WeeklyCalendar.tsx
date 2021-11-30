import {Info} from 'luxon';
import React from 'react';
import styled from 'styled-components';
import type {Event} from './useEvents';

const Wrapper = styled.div``;

const Day = styled.div``;

const DAYS = Info.weekdays();

export default function WeeklyCalendar({
  events,
}: {
  events: Event[];
}): React.ReactElement {
  return (
    <Wrapper>
      {DAYS.map(day => (
        <Day key={day}>{day}</Day>
      ))}
    </Wrapper>
  );
}
