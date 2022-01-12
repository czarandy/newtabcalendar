import {useMemo, useCallback} from 'react';
import useCachedData from './useCachedData';
import fetchFromGoogle from './fetchFromGoogle';
import hash from 'object-hash';

export type Color = {
  background: string;
  foreground: string;
};

async function fetchColors(token: string): Promise<Map<string, Color>> {
  return fetchFromGoogle(token, 'colors');
}

export default function useColors(token: string | null): Map<string, Color> {
  const fetch = useCallback((): any => {
    if (token != null) {
      return fetchColors(token);
    }
    return Promise.resolve({});
  }, [token]);
  const data: any = useCachedData(
    'colors/gcal/v3/' + hash({token}),
    {},
    fetch,
    86400 * 7,
  );
  return useMemo(
    () =>
      data.event
        ? Object.entries(data.event).reduce(
            (m, [key, value]) => m.set(key, value),
            new Map(),
          )
        : new Map(),
    [data],
  );
}
