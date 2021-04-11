import React from 'react';
import styled from 'styled-components';
import {DateTime} from 'luxon';
import type {DateTimeFormatOptions} from 'luxon';

const PrimaryTimestamp = styled.div`
  color: var(--primary-color);
  margin-top: 40px;
  font-size: 144px;
  font-weight: 100;
  position: relative;
  text-shadow: var(--primary-text-shadow);
`;

const SecondaryTimestamp = styled.span`
  color: var(--secondary-color);
  font-size: 48px;
  font-weight: 200;
  letter-spacing: 2px;
  font-weight: 300;
  position: absolute;
  bottom: 56px;
  margin-left: 13px;
  text-shadow: var(--primary-text-shadow);
`;

const DayLabel = styled.div`
  color: var(--secondary-color);
  font-size: 56px;
  font-weight: 200;
  text-shadow: var(--primary-text-shadow);
`;

type Props = {
  now: DateTime;
};

const DT_FORMAT: DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
  year: 'numeric',
};

export default function Time({now}: Props): JSX.Element {
  const time = now.toLocaleString(DateTime.TIME_SIMPLE);
  const parts = time.split(' ');
  return (
    <>
      <PrimaryTimestamp>
        {parts[0]}
        <SecondaryTimestamp>
          {parts.length >= 2 ? parts[1] : null}
        </SecondaryTimestamp>
      </PrimaryTimestamp>
      <DayLabel>{now.toLocaleString(DT_FORMAT)}</DayLabel>
    </>
  );
}
