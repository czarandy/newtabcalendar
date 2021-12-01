import useSyncedState from './useSyncedState';

type WeatherSettings = {
  enabled: boolean;
};

const DEFAULT: WeatherSettings = {
  enabled: true,
};

export function useWeatherSettings(): [
  WeatherSettings,
  (newValue: WeatherSettings) => unknown,
] {
  return useSyncedState<WeatherSettings>('settings/weather/v1', DEFAULT);
}
