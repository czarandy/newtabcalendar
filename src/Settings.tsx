import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import {useState} from 'react';
import {useCalendarSettings} from './useCalendarSettings';
import CloseButton from './CloseButton';

const Wrapper = styled.div`
  position: absolute;
  bottom: 7px;
  left: 8px;
`;

const IconButton = styled.button`
  font-size: 20px;
  border: 0;
  background: transparent;
  cursor: pointer;
  padding: 8px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

const SettingsMenu = styled.div`
  background: var(--overlay-background);
  color: var(--primary-color);
  font-size: 16px;
  border-radius: 12px;
  padding: 12px;
  width: 200px;
  margin-bottom: -8px;
  margin-left: 8px;
`;

const SettingsMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

const SettingsDivider = styled.div`
  background: var(--divider-color);
  height: 1px;
  width: 100%;
  margin: 8px 0;
`;

const SettingsLongDivider = styled.div`
  background: var(--secondary-color);
  opacity: 0.2;
  height: 1px;
  margin: 8px -12px;
`;

export default function Settings(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarSettings, setCalendarSettings] = useCalendarSettings();
  return (
    <Tippy content="Settings">
      <Tippy
        arrow={false}
        placement="top-end"
        interactive={true}
        visible={isOpen}
        onClickOutside={() => setIsOpen(false)}
        className="tippy-reset"
        content={
          <SettingsMenu>
            <SettingsMenuHeader>
              <div>Settings</div>
              <CloseButton onClick={() => setIsOpen(false)} />
            </SettingsMenuHeader>
            <SettingsLongDivider />
          </SettingsMenu>
        }>
        <Wrapper>
          <IconButton className="fas fa-cog" onClick={() => setIsOpen(true)} />
        </Wrapper>
      </Tippy>
    </Tippy>
  );
}
