import styled from 'styled-components';
import Tippy from '@tippyjs/react';
import {useState} from 'react';
import {useCalendarSettings} from './useCalendarSettings';
import CloseButton from './CloseButton';
import useCalendars from './useCalendars';
import Switch from './Switch';
import useAuthToken from './useAuthToken';
import {useWeatherSettings} from './useWeatherSettings';

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
  filter: var(--black-icon-filter);
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

const SwitchSetting = styled.div`
  align-items: center;
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  margin-top: 4px;
`;

const CalendarDotWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CalendarDot = styled.div`
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

export default function Settings(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarSettings, setCalendarSettings] = useCalendarSettings();
  const [weatherSettings, setWeatherSettings] = useWeatherSettings();
  const [tokenResult, _] = useAuthToken();
  const calendars = useCalendars(tokenResult.token);
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
            <SwitchSetting>
              <strong>Weather</strong>
              <Switch
                value={weatherSettings.enabled}
                onChange={enabled => setWeatherSettings({enabled})}
              />
            </SwitchSetting>
            <SettingsDivider />
            <SwitchSetting>
              <strong>Calendar</strong>
              <Switch
                value={calendarSettings.enabled}
                onChange={enabled =>
                  setCalendarSettings({...calendarSettings, enabled})
                }
              />
            </SwitchSetting>
            {calendarSettings.enabled ? (
              <SwitchSetting>
                Weekly View
                <Switch
                  value={calendarSettings.mode === 'weekly'}
                  onChange={enabled =>
                    setCalendarSettings({
                      ...calendarSettings,
                      mode: enabled ? 'weekly' : 'daily',
                    })
                  }
                />
              </SwitchSetting>
            ) : null}
            {calendarSettings.enabled
              ? calendars.map(cal => (
                  <SwitchSetting key={cal.id}>
                    {cal.summary}
                    <CalendarDotWrapper>
                      <CalendarDot
                        style={{backgroundColor: cal.backgroundColor}}
                      />
                      <Switch
                        value={
                          !calendarSettings.disabledCalendars.includes(cal.id)
                        }
                        onChange={enabled => {
                          const newDisabledCalendars = enabled
                            ? calendarSettings.disabledCalendars.filter(
                                c => c != cal.id,
                              )
                            : [...calendarSettings.disabledCalendars, cal.id];
                          setCalendarSettings({
                            ...calendarSettings,
                            disabledCalendars: newDisabledCalendars,
                          });
                        }}
                      />
                    </CalendarDotWrapper>
                  </SwitchSetting>
                ))
              : null}
          </SettingsMenu>
        }>
        <Wrapper>
          <IconButton className="fas fa-cog" onClick={() => {
            setIsOpen(oldIsOpen => !oldIsOpen);
          }} />
        </Wrapper>
      </Tippy>
    </Tippy>
  );
}
