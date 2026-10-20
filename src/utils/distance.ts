// ============================================================================
// TYPES
// ============================================================================

type Coordinates = {
  latitude: number;
  longitude: number;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const EARTH_RADIUS_KM = 6371;

// ============================================================================
// HELPERS
// ============================================================================

function degreesToRadians(degrees: number) {
  return degrees * (Math.PI / 180);
}

// ============================================================================
// DISTANCE
// ============================================================================

export function calculateDistanceKm(start: Coordinates, end: Coordinates) {
  const latitudeDifference = degreesToRadians(end.latitude - start.latitude);

  const longitudeDifference = degreesToRadians(end.longitude - start.longitude);

  const startLatitude = degreesToRadians(start.latitude);

  const endLatitude = degreesToRadians(end.latitude);

  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(startLatitude) *
      Math.cos(endLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  const angularDistance =
    2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return EARTH_RADIUS_KM * angularDistance;
}

export function formatDistance(distanceKm: number) {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1).replace(".", ",")} km`;
  }

  return `${Math.round(distanceKm)} km`;
}
