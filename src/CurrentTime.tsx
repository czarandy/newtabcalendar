import {DateTime} from 'luxon';
import styled from 'styled-components';
import getLeftPercent from './getLeftPercent';

const CurrentTimeLine = styled.div`
  background: #d68d4a;
  width: 2px;
  height: 120px;
  position: absolute;
  pointer-events: none;
`;

const CurrentTimeBall = styled.div`
  background: #d68d4a;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  margin-left: -4px;
  margin-top: -4px;
`;

export default function CurrentTime(props: {
  now: DateTime;
  fullDay: boolean;
}): React.ReactElement | null {
  const left = getLeftPercent(props.now, props.fullDay);
  if (left <= 0 || left >= 100) {
    return null;
  }
  return (
    <>
      <CurrentTimeBall style={{left: left + '%'}} />
      <CurrentTimeLine style={{left: left + '%'}} />
    </>
  );
}
