import {DateTime} from 'luxon';

export default function getLeftPercent(
  date: DateTime,
  fullDay: boolean = true,
): number {
  const LENGTH = (fullDay ? 24 : 12) * 3600;
  let startOfDay = date.startOf('day');
  if (!fullDay) {
    startOfDay = startOfDay.set({hour: 7});
  }
  return (100 * date.diff(startOfDay).as('seconds')) / LENGTH;
}
