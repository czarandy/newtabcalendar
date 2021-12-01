import {DateTime} from 'luxon';
import {useEffect, useState} from 'react';
import useDateTime from './useDateTime';

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

type CachedValue<T> = {
  dt: DateTime;
  data: T;
};

export default function useCachedData<T>(
  key: string,
  defaultValue: T,
  fetch: () => Promise<T>,
  timeout: number = 60 * 60,
): T {
  const now = useDateTime();
  const [cachedValue, setCachedValue] = useState<CachedValue<T> | null>(null);
  useEffect(() => {
    async function fetchFromSource() {
      const data = await fetch();
      const value: CachedValue<T> = {
        dt: now,
        data,
      };
      setCachedValue(value);
      await setLocalStorage(key, value);
    }

    (async function () {
      // If no data yet, simply get it from local storage
      if (cachedValue == null) {
        const result = await getLocalStorage(key);
        if (!result) {
          await fetchFromSource();
        } else {
          setCachedValue(result);
        }
      }
      // If we do have some data, possibly refetch it if it's old
      if (
        cachedValue != null &&
        now.diff(cachedValue.dt).as('seconds') > timeout
      ) {
        fetchFromSource();
      }
    })();
  }, [cachedValue, now, fetch]);
  return cachedValue == null ? defaultValue : cachedValue.data;
}
