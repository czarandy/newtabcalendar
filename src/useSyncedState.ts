import {useCallback, useEffect, useState} from 'react';

function genv(keys: string[]): Promise<{[key: string]: string}> {
  return new Promise(resolve => chrome.storage.sync.get(keys, resolve));
}

async function gen(key: string): Promise<string> {
  const items = await genv([key]);
  return items[key];
}

function genSetObject(obj: any): Promise<void> {
  return new Promise(resolve => chrome.storage.sync.set(obj, resolve));
}

async function genSet(key: string, value: string): Promise<void> {
  return await genSetObject({[key]: value});
}

export default function useSyncedState<T>(
  key: string,
  defaultValue: T,
  remoteDefaultValue?: T,
): [T, (newValue: T) => unknown] {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    gen(key).then((localData: string) =>
      setValue(
        localData === null || localData === undefined
          ? remoteDefaultValue ?? defaultValue
          : JSON.parse(localData),
      ),
    );
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      for (const k in changes) {
        const storageChange = changes[key];
        if (
          k === key &&
          storageChange.newValue !== value &&
          namespace === 'sync'
        ) {
          setValue(JSON.parse(storageChange.newValue));
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValueWrapper = useCallback(
    newValue => {
      const json = JSON.stringify(newValue);
      genSet(key, json);
      setValue(newValue);
    },
    [key],
  );

  return [value, setValueWrapper];
}
