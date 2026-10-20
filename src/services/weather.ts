// ============================================================================
// IMPORTS
// ============================================================================

import { getTodayDate, isValidEventDate } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

export type EventWeather = {
  condition: string;
  minTemperature: number;
  maxTemperature: number;
  precipitationProbability: number | null;
};

type WeatherDailyResponse = {
  time: string[];
  weather_code: (number | null)[];
  temperature_2m_max: (number | null)[];
  temperature_2m_min: (number | null)[];
  precipitation_probability_max: (number | null)[];
};

type WeatherResponse = {
  daily?: WeatherDailyResponse;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const FORECAST_DAYS = 16;

// ============================================================================
// HELPERS
// ============================================================================

function formatLocalDate(date: Date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeatherCondition(code: number) {
  if (code === 0) {
    return "Ciel dégagé";
  }

  if ([1, 2].includes(code)) {
    return "Partiellement nuageux";
  }

  if (code === 3) {
    return "Couvert";
  }

  if ([45, 48].includes(code)) {
    return "Brouillard";
  }

  if ([51, 53, 55, 56, 57].includes(code)) {
    return "Bruine";
  }

  if ([61, 63, 65, 66, 67].includes(code)) {
    return "Pluie";
  }

  if ([71, 73, 75, 77].includes(code)) {
    return "Neige";
  }

  if ([80, 81, 82].includes(code)) {
    return "Averses";
  }

  if ([85, 86].includes(code)) {
    return "Averses de neige";
  }

  if ([95, 96, 99].includes(code)) {
    return "Orage";
  }

  return "Conditions variables";
}

// ============================================================================
// FORECAST AVAILABILITY
// ============================================================================

export function isWeatherForecastDateAvailable(date: string) {
  if (!isValidEventDate(date)) {
    return false;
  }

  const today = getTodayDate();

  const [year, month, day] = today.split("-").map(Number);

  const lastForecastDate = new Date(year, month - 1, day);

  lastForecastDate.setDate(lastForecastDate.getDate() + FORECAST_DAYS - 1);

  const maxDate = formatLocalDate(lastForecastDate);

  return date >= today && date <= maxDate;
}

// ============================================================================
// WEATHER
// ============================================================================

export async function getEventWeather(
  latitude: number,
  longitude: number,
  date: string,
): Promise<EventWeather | null> {
  if (!isWeatherForecastDateAvailable(date)) {
    return null;
  }

  try {
    const dailyVariables = [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
    ].join(",");

    const url =
      `${WEATHER_URL}` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&daily=${dailyVariables}` +
      "&timezone=auto" +
      `&forecast_days=${FORECAST_DAYS}`;

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as WeatherResponse;

    if (!data.daily) {
      return null;
    }

    const index = data.daily.time.indexOf(date);

    if (index === -1) {
      return null;
    }

    const weatherCode = data.daily.weather_code[index];

    const maxTemperature = data.daily.temperature_2m_max[index];

    const minTemperature = data.daily.temperature_2m_min[index];

    const precipitationProbability =
      data.daily.precipitation_probability_max[index];

    if (
      weatherCode === null ||
      maxTemperature === null ||
      minTemperature === null
    ) {
      return null;
    }

    return {
      condition: getWeatherCondition(weatherCode),
      minTemperature,
      maxTemperature,
      precipitationProbability,
    };
  } catch {
    return null;
  }
}
