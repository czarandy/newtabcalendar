import Tippy from '@tippyjs/react';
import styled from 'styled-components';
import {Event} from './useEvents';
import Linkify from 'react-linkify';

const Wrapper = styled.div`
  border: 1px solid #ffffff5f;
  border-radius: 8px;
  opacity: 1;
  padding: 12px;
  font-size: 14px;
  background-color: var(--overlay-background);
  color: var(--primary-color);
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const Time = styled.div`
  margin-top: 4px;
  white-space: nowrap;
  margin-bottom: 4px;
`;

const Description = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  overflow: auto;
  margin: 8px 0;
  max-height: 150px;
  font-size: 12px;
  a {
    text-decoration: none;
    color: var(--primary-color);
  }
  a:hover {
    text-decoration: underline;
  }
`;

const TitleLink = styled.a`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  color: var(--primary-color);
`;

export default function EventPopover({
  event,
}: {
  event: Event;
}): React.ReactElement {
  const description = event.description;
  return (
    <Wrapper>
      <Title>
        <TitleLink href={event.url}>{event.summary}</TitleLink>
      </Title>
      <Time>
        {event.start.toLocaleString({timeStyle: 'short'})}
        {' - '}
        {event.end.toLocaleString({timeStyle: 'short'})}
      </Time>
      {description !== '' ? (
        <Description>
          <Linkify>{description}</Linkify>
        </Description>
      ) : null}
    </Wrapper>
  );
}