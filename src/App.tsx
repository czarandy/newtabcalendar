import styled from 'styled-components';
import { DateTime } from 'luxon';

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

const UpNextWrapper = styled.div`
  grid-column: 2;
  grid-row: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 36px;
`;

function Time() {
  return null;
}
function UpNext() {
  return null;
}
function Calendar() {
  return null;
}

export default function App() {
  return (
    <Wrapper>
      <Header>
        <Time now={this.state.now} />
      </Header>
      <UpNextWrapper>
        <UpNext event={upNext} />
        <Calendar
          now={this.state.now}
          customNow={this._getCustomNow()}
          hideCurrentTime={!sameDay(this._getCustomNow(), this.state.now)}
          events={todayEvents}
          start={this.state.start}
          end={this.state.end}
          onNext={this._onNext}
          onPrevious={() => {
            const customNow = this._getCustomNow();
            customNow.setDate(customNow.getDate() - 1);
            this.setState(
              {
                customNow,
              },
              this._update
            );
          }}
        />
      </UpNextWrapper>
    </Wrapper>
  );
}

/*
import BookmarkBar from './BookmarkBar.js';
import Calendar from './Calendar.js';
import Clocks from './Clocks.js';
import EarlyMeeting from './EarlyMeeting.js';
import ErrorMessage from './ErrorMessage.js';
import LeftNav from './LeftNav.js';
import React, {Component} from 'react';
import Search from './Search.js';
import Time from './Time.js';
import UpNext from './UpNext.js';
import RightPane from './RightPane.js';
import genCalendar from './genCalendar.js';
import genLog from './genLog.js';
import getInternURL from './getInternURL.js';
import Pixelcloud from './Pixelcloud.js';
import {cleanup} from './GraphQL.js';
import TipsTricks from './TipsTricks.js';

import './App.css';
import 'tippy.js/dist/tippy.css';

function sameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

class App extends Component {
  state = {
    internmc: true,
    now: new Date(),
    customNow: null,
    start: null,
    end: null,
    sources: [],
    futureSources: [],
  };

  _getEvents(sources) {
    let flatEvents = [];
    sources.forEach(source => {
      source.events.forEach(event => {
        // Skip canceled events
        if (event.is_canceled) {
          return;
        }
        // Skip all day events
        if (event.is_all_day_event) {
          return;
        }
        // Skip Blocks w/ 1 attendee and no rooms
        if (
          source.label === 'Block' &&
          event.attendees.length < 2 &&
          (event.rooms == null || event.rooms.length === 0)
        ) {
          return;
        }
        event.color = source.color;
        flatEvents.push(event);
      });
    });
    flatEvents.sort((a, b) => {
      if (a.start_time !== b.start_time) {
        return a.start_time - b.start_time;
      }
      if (a.is_tentative !== b.is_tentative) {
        if (a.is_tentative) {
          return 1;
        }
        return -1;
      }
      return 0;
    });
    return flatEvents;
  }

  render() {
    if (!this.state.internmc) {
      return (
        <div className="wrapper">
          <ErrorMessage title="Intern New Tab requires InternMC!">
            <a href="https://fburl.com/intern-new-tab-internmc-onboard">
              Opt-in to InternMC
            </a>{' '}
            to use.
          </ErrorMessage>
        </div>
      );
    }

    const todayEvents = this._getEvents(this.state.sources);
    // Allow a buffer of half meeting length in case you are late to your meeting
    let upNext = todayEvents.find(
      e =>
        e.start_time > this.state.now / 1000 - (e.end_time - e.start_time) / 2
    );
    if (upNext == null) {
      // Check future sources
      for (let futureSource of this.state.futureSources) {
        const futureEvents = this._getEvents(futureSource);
        upNext = futureEvents.find(e => e.start_time > this.state.now / 1000);
        if (upNext != null) {
          break;
        }
      }
    }

    let earlyMeeting = null;
    {
      const now = this.state.customNow || this.state.now;
      for (let source of [this.state.sources, ...this.state.futureSources]) {
        earlyMeeting = EarlyMeeting.find(now, this._getEvents(source));
        if (earlyMeeting) break;
      }
    }

    return (
      <div className="wrapper">
        <div className="header">
          <Time now={this.state.now} />
          <Search />
        </div>
        <div className="calendarUpNextWrapper">
          <TipsTricks />
          <UpNext event={upNext} />
          <Calendar
            now={this.state.now}
            customNow={this._getCustomNow()}
            hideCurrentTime={!sameDay(this._getCustomNow(), this.state.now)}
            events={todayEvents}
            start={this.state.start}
            end={this.state.end}
            onNext={this._onNext}
            onPrevious={() => {
              const customNow = this._getCustomNow();
              customNow.setDate(customNow.getDate() - 1);
              this.setState(
                {
                  customNow,
                },
                this._update
              );
            }}
          />
          <EarlyMeeting event={earlyMeeting} />
        </div>
        <RightPane />

        <BookmarkBar />
        <Clocks now={this.state.now} />
        <LeftNav />
        <Pixelcloud />
      </div>
    );
  }

  _onNext = () => {
    const customNow = this._getCustomNow();
    customNow.setDate(customNow.getDate() + 1);
    this.setState(
      {
        customNow,
      },
      this._update
    );
  };

  componentDidMount = () => {
    genLog('load');
    this._checkInternMC();
    setInterval(this._update, 5000);
    if (performance.navigation.type === 1) {
      // synchronous clear on refresh
      cleanup(true).then(this._update);
    } else {
      this._update();
      cleanup(false);
    }
  };

  _getCustomNow() {
    const now = this.state.now;
    let customNow = this.state.customNow;
    if (customNow == null && now.getHours() >= 19) {
      // show next day
      customNow = new Date(now);
      customNow.setDate(customNow.getDate() + 1);
    }
    return customNow || now;
  }

  _getStartEnd(date) {
    let start = new Date(date);
    start.setHours(0);
    start.setMinutes(0);
    start.setSeconds(0);
    start = Math.floor(start / 1000);
    let end = new Date(date);
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59);
    end = Math.floor(end / 1000);
    return [start, end];
  }

  _update = () => {
    const now = new Date();
    const customNow = this._getCustomNow();
    const [start, end] = this._getStartEnd(customNow);
    this.setState({
      now,
      start,
      end,
    });
    genCalendar(start, end, sources => this.setState({sources}));
    const date = new Date(start * 1000);
    // Preload nearby days together
    const promises = [];
    for (let i = -1; i <= 4; ++i) {
      if (i === 0) {
        continue;
      }
      const thisDate = new Date(date);
      thisDate.setDate(thisDate.getDate() + i);
      const [start, end] = this._getStartEnd(thisDate);
      if (i > 0) {
        promises.push(new Promise(resolve => genCalendar(start, end, resolve)));
      } else {
        genCalendar(start, end, () => {});
      }
    }
    Promise.all(promises).then(futureSources => this.setState({futureSources}));
  };

  async _checkInternMC() {
    const response = await fetch(getInternURL('/auth/check?json=true'));

    // Invalid response
    if (response.status !== 200) {
      this.setState({internmc: false});
      return;
    }
    const text = await response.text();
    if (text == null) {
      this.setState({internmc: false});
      return;
    }

    // Check result
    const result = JSON.parse(text.slice(9));
    const corpIP = result.is_corp_ip;
    const passed = result.response.indexOf('pass') === 0;
    this.setState({internmc: corpIP || passed});
  }
}

export default App;
*/
