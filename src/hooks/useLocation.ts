// ============================================================================
// IMPORTS
// ============================================================================

import { useEffect, useState } from "react";
import * as Location from "expo-location";

// ============================================================================
// TYPES
// ============================================================================

export type UserCoordinates = {
  latitude: number;
  longitude: number;
};

export type UserLocationStatus =
  | "loading"
  | "granted"
  | "denied"
  | "unavailable";

// ============================================================================
// HOOK
// ============================================================================

export function useLocation() {
  const [coordinates, setCoordinates] = useState<UserCoordinates | null>(null);

  const [status, setStatus] = useState<UserLocationStatus>("loading");

  // --- Demande de localisation ----------------------------------------------

  useEffect(() => {
    let active = true;

    async function loadLocation() {
      try {
        // Seule la localisation au premier plan est nécessaire à l'application.
        const permission = await Location.requestForegroundPermissionsAsync();

        if (!active) {
          return;
        }

        if (permission.status !== "granted") {
          setStatus("denied");
          return;
        }

        // Une position ponctuelle suffit pour calculer la distance aux événements.
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        if (!active) {
          return;
        }

        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setStatus("granted");
      } catch {
        if (active) {
          setStatus("unavailable");
        }
      }
    }

    loadLocation();

    return () => {
      active = false;
    };
  }, []);

  return {
    coordinates,
    status,
  };
}
