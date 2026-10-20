// ============================================================================
// IMPORTS
// ============================================================================

import { Button, StyleSheet, Text, View } from "react-native";

import { useEventWeather } from "../hooks/useEventWeather";
import type { UserCoordinates, UserLocationStatus } from "../hooks/useLocation";
import type { Event } from "../types";
import { calculateDistanceKm, formatDistance } from "../utils/distance";
import { formatEventDateTime, isEventPast } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type EventCardProps = {
  event: Event;
  userCoordinates: UserCoordinates | null;
  locationStatus: UserLocationStatus;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleParticipated: (id: string) => void;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function EventCard({
  event,
  userCoordinates,
  locationStatus,
  onEdit,
  onDelete,
  onToggleParticipated,
}: EventCardProps) {
  const eventPast = isEventPast(event.date, event.time);

  const eventCoordinates =
    event.location?.latitude !== undefined &&
    event.location?.longitude !== undefined
      ? {
          latitude: event.location.latitude,
          longitude: event.location.longitude,
        }
      : null;

  const distance =
    userCoordinates && eventCoordinates
      ? calculateDistanceKm(userCoordinates, eventCoordinates)
      : null;

  const { weather, status: weatherStatus } = useEventWeather({
    date: event.date,
    latitude: eventCoordinates?.latitude,
    longitude: eventCoordinates?.longitude,
    enabled: !eventPast,
  });

  function handleEdit() {
    onEdit(event.id);
  }

  function handleDelete() {
    onDelete(event.id);
  }

  function handleToggleParticipated() {
    onToggleParticipated(event.id);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.date}>
        {formatEventDateTime(event.date, event.time)}
      </Text>

      {event.location ? (
        <>
          <Text style={styles.location}>Lieu : {event.location.name}</Text>

          {distance !== null ? (
            <Text style={styles.distance}>
              Distance : environ {formatDistance(distance)}
            </Text>
          ) : eventCoordinates ? (
            <Text style={styles.distance}>
              {locationStatus === "loading"
                ? "Distance : localisation en cours..."
                : "Distance : localisation utilisateur indisponible"}
            </Text>
          ) : (
            <Text style={styles.distance}>
              Distance : coordonnées du lieu indisponibles
            </Text>
          )}

          {!eventPast && eventCoordinates ? (
            <View style={styles.weather}>
              {weatherStatus === "loading" ? (
                <Text>Météo : chargement...</Text>
              ) : null}

              {weatherStatus === "available" && weather ? (
                <>
                  <Text>Météo : {weather.condition}</Text>

                  <Text>
                    Températures : {Math.round(weather.minTemperature)}
                    °C à {Math.round(weather.maxTemperature)}
                    °C
                  </Text>

                  {weather.precipitationProbability !== null ? (
                    <Text>
                      Risque de pluie :{" "}
                      {Math.round(weather.precipitationProbability)}%
                    </Text>
                  ) : null}
                </>
              ) : null}

              {weatherStatus === "out-of-range" ? (
                <Text>
                  {
                    "Météo : prévisions disponibles à l'approche de l'événement."
                  }
                </Text>
              ) : null}

              {weatherStatus === "unavailable" ? (
                <Text>Météo : indisponible.</Text>
              ) : null}
            </View>
          ) : null}
        </>
      ) : null}

      <Text style={styles.description}>{event.description}</Text>

      <Text style={styles.status}>
        Statut : {eventPast ? "Passé" : "À venir"}
      </Text>

      <Text style={styles.participation}>
        Participation : {event.participated ? "Participé" : "Non participé"}
      </Text>

      <View style={styles.actions}>
        <Button
          title={
            eventPast
              ? "Événement passé"
              : event.participated
                ? "Annuler la participation"
                : "Rejoindre l'événement"
          }
          onPress={handleToggleParticipated}
          disabled={eventPast}
        />

        <Button title="Modifier" onPress={handleEdit} />

        <Button title="Supprimer" onPress={handleDelete} />
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  date: {
    marginBottom: 6,
  },
  location: {
    marginBottom: 4,
    fontWeight: "500",
  },
  distance: {
    marginBottom: 6,
  },
  weather: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
  },
  status: {
    fontWeight: "600",
    marginBottom: 4,
  },
  participation: {
    fontWeight: "500",
    marginBottom: 12,
  },
  actions: {
    gap: 8,
    alignItems: "flex-start",
  },
});
