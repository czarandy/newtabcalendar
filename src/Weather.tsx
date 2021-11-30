import React from 'react';
import {useState, useEffect} from 'react';
import {DateTime} from 'luxon';
import styled from 'styled-components';

const WeatherWrapper = styled.div`
  margin: 8px 16px;
  display: flex;
  justify-content: flex-end;
  flex-direction: row;
  margin-bottom: 16px;
`;

const WeatherToday = styled.div`
  font-size: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
`;

const WeatherTodayText = styled.div`
  margin-right: 12px;
  font-size: 54px;
  margin-bottom: 6px;
`;

const WeatherDaysWrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 32px;
`;

const WeatherDay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WeatherTemp = styled.div`
  font-size: 16px;
`;

const WeatherLabel = styled.div`
  font-size: 18px;
`;

const WeatherIcon = styled.div`
  margin: 4px 0;
  font-size: 24px;
`;

const WeatherTodayIcon = styled.i`
  margin-top: 2px;
  width: 52px;
`;

function getIcon(forecast: string, isNight: boolean): string | null {
  switch (forecast) {
    case 'Haze':
      return 'fa-smoke';
    case 'Patchy Fog':
    case 'Areas Of Fog':
      return 'fa-fog';
    case 'Sunny':
    case 'Mostly Sunny':
      return 'fa-sun';
    case 'Partly Sunny':
      return 'fa-cloud-sun';
    case 'Mostly Clear':
    case 'Partly Cloudy':
      return isNight ? 'fa-cloud-moon' : 'fa-cloud-sun';
    case 'Mostly Cloudy':
    case 'Cloudy':
      return 'fa-cloud';
    case 'Clear':
      return isNight ? 'fa-moon' : 'fa-sun';
    default:
      return null;
  }
  return null;
}

function arrayMax(a: number[]): number {
  return a.reduce((a, b) => Math.max(a, b), 0);
}

function arrayMin(a: number[]): number {
  return a.reduce((a, b) => Math.min(a, b), 100000);
}

function arrayMode(array: number[]): number | null {
  if (array.length === 0) {
    return null;
  }
  const modeMap = new Map();
  let maxEl = array[0];
  let maxCount = 1;
  for (let i = 0; i < array.length; i++) {
    const el = array[i];
    const value = (modeMap.get(el) || 0) + 1;
    modeMap.set(el, value);
    if (value > maxCount) {
      maxEl = el;
      maxCount = value;
    }
  }
  return maxEl;
}

function setLocalStorage(key: string, value: any): Promise<void> {
  return new Promise(resolve =>
    chrome.storage.local.set({[key]: value}, resolve),
  );
}

function getLocalStorage(key: string): Promise<any> {
  return new Promise(resolve =>
    chrome.storage.local.get([key], result => {
      resolve(result[key]);
    }),
  );
}

function hashCode(str: string): string {
  let hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
}

const TIMEOUT = 3600;
const KEY = 'newtab/weather/';

async function fetchCached(url: string): Promise<any> {
  const key = KEY + hashCode(url);
  const localData = await getLocalStorage(key);
  const now = DateTime.now();
  if (localData) {
    const parsedData = JSON.parse(localData);
    if (now.diff(DateTime.fromMillis(parsedData.dt)).as('seconds') < TIMEOUT) {
      return [JSON.parse(parsedData.result), false];
    } else {
      return [JSON.parse(parsedData.result), true];
    }
  }
  const data = await fetch(url);
  const result = await data.text();
  const value = {
    dt: +now,
    result,
  };
  await setLocalStorage(key, JSON.stringify(value));
  return [JSON.parse(result), false];
}

async function fetchJSON(url: string): Promise<any> {
  const data = await fetch(url);
  const result = await data.text();
  const key = KEY + hashCode(url);
  await setLocalStorage(key, JSON.stringify({dt: +DateTime.now(), result}));
  const json = JSON.parse(result);
  return [json, false];
}

async function fetchData(onChange: any, forceFetch = false) {
  const [json, needsUpdateA] = await (forceFetch ? fetchJSON : fetchCached)(
    'https://api.weather.gov/points/37.27,-121.9272',
  );
  const [forecast, needsUpdateB] = await (forceFetch ? fetchJSON : fetchCached)(
    json.properties.forecastHourly,
  );
  if (!forecast.properties) {
    fetchData(onChange, true);
    return;
  }
  const now = DateTime.now();
  const periods = forecast.properties.periods;
  // group by day
  const days: any[] = [];
  let prevDay: any = null;
  periods.forEach((e: any) => {
    const day = DateTime.fromISO(e.startTime).toISODate();
    if (prevDay == null || day !== prevDay) {
      days.push([]);
      prevDay = day;
    }
    days[days.length - 1].push(e);
  });
  // Get value right now
  const rightNow = periods.find((p: any) => DateTime.fromISO(p.endTime) > now);
  // Get summary for each day
  onChange({
    rightNow,
    days: days
      .slice(0, 4)
      .map(day => {
        if (DateTime.fromISO(day[0].startTime).toISODate() < now.toISODate()) {
          return null;
        }
        const high = arrayMax(day.map((p: any) => p.temperature));
        const low = arrayMin(day.map((p: any) => p.temperature));
        const isToday =
          DateTime.fromISO(day[0].startTime).toISODate() === now.toISODate();
        const icon = arrayMode(
          day.map((p: any) => getIcon(p.shortForecast, false)).filter(Boolean),
        );
        return {
          low,
          high,
          icon,
          label: isToday
            ? 'Today'
            : DateTime.fromISO(day[0].startTime).toLocaleString({
                weekday: 'short',
              }),
        };
      })
      .filter(Boolean),
  });
  if (needsUpdateA || needsUpdateB) {
    fetchData(onChange, true);
  }
}

export default function Weather() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    fetchData(setData);
  }, []);
  if (data == null) {
    return null;
  }
  const {rightNow, days} = data;
  return (
    <WeatherWrapper>
      {1 + 2 !== 5 / 6 && rightNow ? (
        <WeatherToday>
          <WeatherTodayText>
            {rightNow.temperature + String.fromCharCode(176)}
          </WeatherTodayText>
          <WeatherTodayIcon
            className={
              'fal ' + getIcon(rightNow.shortForecast, !rightNow.isDaytime)
            }
          />
        </WeatherToday>
      ) : null}
      <WeatherDaysWrapper>
        {rightNow ? (
          <WeatherDay>
            <WeatherLabel>Now</WeatherLabel>
            <WeatherIcon>
              <i
                className={
                  'fas ' + getIcon(rightNow.shortForecast, !rightNow.isDaytime)
                }
              />
            </WeatherIcon>
            <WeatherTemp>
              {rightNow.temperature + String.fromCharCode(176)}
            </WeatherTemp>
          </WeatherDay>
        ) : null}
        {days.map((day: any) => (
          <WeatherDay key={day.label}>
            <WeatherLabel>{day.label}</WeatherLabel>
            <WeatherIcon>
              <i className={'fas ' + day.icon} />
            </WeatherIcon>
            <WeatherTemp>
              {day.low + String.fromCharCode(176)}{' '}
              {day.high + String.fromCharCode(176)}
            </WeatherTemp>
          </WeatherDay>
        ))}
      </WeatherDaysWrapper>
    </WeatherWrapper>
  );
}
