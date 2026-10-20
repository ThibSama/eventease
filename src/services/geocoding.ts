// ============================================================================
// IMPORTS
// ============================================================================

import type { EventLocation } from "../types";

// ============================================================================
// TYPES
// ============================================================================

type GeocodingResult = {
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
};

type GeocodingResponse = {
  results?: GeocodingResult[];
};

// ============================================================================
// CONSTANTS
// ============================================================================

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

// ============================================================================
// GEOCODING
// ============================================================================

export async function geocodeLocation(
  query: string,
): Promise<EventLocation | null> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return null;
  }

  try {
    const url =
      `${GEOCODING_URL}` +
      `?name=${encodeURIComponent(normalizedQuery)}` +
      "&count=1" +
      "&language=fr" +
      "&format=json";

    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GeocodingResponse;

    const result = data.results?.[0];

    if (!result) {
      return null;
    }

    const locationParts = [result.name, result.admin1, result.country].filter(
      Boolean,
    );

    return {
      name: locationParts.join(", "),
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch {
    return null;
  }
}
