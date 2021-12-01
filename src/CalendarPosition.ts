import {DateTime} from 'luxon';
import getLeftPercent from './getLeftPercent';

export function getLeft(date: DateTime, fullDay: boolean): string {
  const left = Math.max(0, getLeftPercent(date, fullDay)) + '%';
  if (date.minute === 0) {
    return 'calc(' + left + ' + 3px)';
  }
  return left;
}

export function getRight(date: DateTime, fullDay: boolean): string {
  const LENGTH = (fullDay ? 24 : 12) * 3600;
  let endOfDay = date.endOf('day');
  if (!fullDay) {
    endOfDay = endOfDay.set({second: 0, minute: 0, hour: 19});
  }
  const right =
    Math.max(0, (100 * endOfDay.diff(date).as('seconds')) / LENGTH) + '%';
  if (date.minute === 0) {
    return 'calc(' + right + ' + 3px)';
  }
  return right;
}
