import useDateTime from './useDateTime';
import styled from 'styled-components';
import Time from './Time';
import Calendar from './Calendar';
import Weather from './Weather';
import Settings from './Settings';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: min-content min-content 1fr 1fr min-content;
  grid-template-columns: min-content 1fr;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: 300;
  grid-row: 3;
  grid-column: 2;
  margin-right: 36px;
`;

const WeatherWrapper = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  justify-self: flex-end;
`;

const UpNextWrapper = styled.div`
  grid-column: 2;
  grid-row: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 32px;
  justify-content: center;
`;

// Cleanup storage on load
async function cleanup() {
  const bytesInUse = await chrome.storage.local.getBytesInUse();
  if (bytesInUse > 0.75 * chrome.storage.local.QUOTA_BYTES) {
    await chrome.storage.local.clear();
  }
}
cleanup();

export default function App(): React.ReactElement {
  const now = useDateTime();
  return (
    <Wrapper>
      <Header>
        <Time now={now} />
      </Header>
      <WeatherWrapper>
        <Weather />
      </WeatherWrapper>
      <UpNextWrapper>
        <Calendar />
      </UpNextWrapper>
      <Settings />
    </Wrapper>
  );
}
