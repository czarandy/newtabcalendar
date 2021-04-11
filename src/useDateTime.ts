import {DateTime} from 'luxon';
import {useState, useEffect} from 'react';

export default function useDateTime(): DateTime {
  const [now, setNow] = useState(DateTime.now());

  useEffect(() => {
    const id = setInterval(() => setNow(DateTime.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}
