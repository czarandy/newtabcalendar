import styled from 'styled-components';

const HourCell = styled.div`
  display: flex;
  flex-grow: 1;
  flex-basis: 0;
`;

const Divider = styled.div`
  background: var(--border-color);
  width: 1px;
  height: 70px;
`;

const HourDiv = styled.div<{primaryColor: boolean}>`
  padding-left: 5px;
  color: ${props =>
    props.primaryColor ? 'var(--primary-color)' : 'var(--secondary-color)'};
`;

const use24Hour = false;

export default function Hour(props: {
  hourNum: number;
  isFuture: boolean;
}): React.ReactElement {
  let hour = String(props.hourNum);
  if (hour != null) {
    if (use24Hour) {
      if (props.hourNum < 10) {
        hour = '0' + hour;
      }
      hour = hour + ':00';
    } else if (props.hourNum === 0) {
      hour = '12 AM';
    } else if (props.hourNum === 12) {
      hour = '12 PM';
    } else if (props.hourNum > 12) {
      hour = String(props.hourNum - 12) + ' PM';
    } else {
      hour = hour + ' AM';
    }
  }
  return (
    <HourCell>
      <Divider />
      {hour != null ? (
        <HourDiv primaryColor={props.isFuture}>{hour}</HourDiv>
      ) : null}
    </HourCell>
  );
}
