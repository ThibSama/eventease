// ============================================================================
// IMPORTS
// ============================================================================

import { useEffect, useState } from "react";

import {
  getEventWeather,
  isWeatherForecastDateAvailable,
  type EventWeather,
} from "../services/weather";

// ============================================================================
// TYPES
// ============================================================================

export type EventWeatherStatus =
  | "idle"
  | "loading"
  | "available"
  | "out-of-range"
  | "unavailable";

type UseEventWeatherParams = {
  date: string;
  latitude?: number;
  longitude?: number;
  enabled?: boolean;
};

type WeatherResult = {
  key: string;
  weather: EventWeather | null;
};

// ============================================================================
// HOOK
// ============================================================================

export function useEventWeather({
  date,
  latitude,
  longitude,
  enabled = true,
}: UseEventWeatherParams) {
  const forecastDateAvailable = isWeatherForecastDateAvailable(date);

  const canLoadWeather =
    enabled &&
    latitude !== undefined &&
    longitude !== undefined &&
    forecastDateAvailable;

  const requestKey = canLoadWeather ? `${date}:${latitude}:${longitude}` : null;

  const [result, setResult] = useState<WeatherResult | null>(null);

  useEffect(() => {
    if (!requestKey || latitude === undefined || longitude === undefined) {
      return;
    }

    let active = true;

    async function loadWeather() {
      const weather = await getEventWeather(
        latitude as number,
        longitude as number,
        date,
      );

      if (!active) {
        return;
      }

      setResult({
        key: requestKey as string,
        weather,
      });
    }

    loadWeather();

    return () => {
      active = false;
    };
  }, [date, latitude, longitude, requestKey]);

  let status: EventWeatherStatus = "idle";

  let weather: EventWeather | null = null;

  if (enabled && latitude !== undefined && longitude !== undefined) {
    if (!forecastDateAvailable) {
      status = "out-of-range";
    } else if (!result || result.key !== requestKey) {
      status = "loading";
    } else if (result.weather) {
      status = "available";
      weather = result.weather;
    } else {
      status = "unavailable";
    }
  }

  return {
    weather,
    status,
  };
}
