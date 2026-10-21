// ============================================================================
// IMPORTS
// ============================================================================

import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { UserCoordinates } from "../hooks/useLocation";
import { colors, radius } from "../theme";
import type { Event } from "../types";
import { formatDistance } from "../utils/distance";
import {
  formatDayNumber,
  formatShortDate,
  getEventDistanceKm,
  getShortLocationName,
} from "../utils/eventDisplay";
import { isEventPast } from "../utils/validation";
import { Badge } from "./Badge";

// ============================================================================
// TYPES
// ============================================================================

type EventCardProps = {
  event: Event;
  userCoordinates: UserCoordinates | null;
  dateFormat?: "day" | "short";
  onPress: (id: string) => void;
};

// ============================================================================
// COMPOSANT
// ============================================================================

export function EventCard({
  event,
  userCoordinates,
  dateFormat = "day",
  onPress,
}: EventCardProps) {
  // --- État de l'événement ---------------------------------------------------

  const eventPast = isEventPast(event.date, event.time);

  // --- Lieu et distance ------------------------------------------------------

  const distance = getEventDistanceKm(event, userCoordinates);

  const locationLabel = event.location
    ? [
        getShortLocationName(event),
        distance !== null ? formatDistance(distance) : null,
      ]
        .filter(Boolean)
        .join(" · ")
    : null;

  // --- Actions ---------------------------------------------------------------

  function handlePress() {
    onPress(event.id);
  }

  // --- Rendu -----------------------------------------------------------------

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ouvrir ${event.title}`}
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.accent, eventPast && styles.accentPast]} />

      <View style={styles.dateColumn}>
        <Text
          style={dateFormat === "day" ? styles.dayNumber : styles.shortDate}>
          {dateFormat === "day"
            ? formatDayNumber(event.date)
            : formatShortDate(event.date)}
        </Text>

        <Text style={styles.time}>{event.time}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>

        {locationLabel ? (
          <View style={styles.locationRow}>
            <Image
              source={require("../assets/images/design/icon-location.svg")}
              style={styles.locationIcon}
              contentFit="contain"
            />

            <Text style={styles.location} numberOfLines={1}>
              {locationLabel}
            </Text>
          </View>
        ) : null}

        <View style={styles.badges}>
          <Badge
            label={eventPast ? "Passé" : "À venir"}
            tone={eventPast ? "past" : "upcoming"}
          />

          {event.participated ? (
            <Badge label={eventPast ? "Participé" : "Inscrit"} tone="joined" />
          ) : null}
        </View>
      </View>

      <Image
        source={require("../assets/images/design/icon-chevron-right.svg")}
        style={styles.chevron}
        contentFit="contain"
      />
    </Pressable>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  card: {
    minHeight: 103,
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingTop: 11,
    paddingBottom: 10,
    paddingRight: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  accent: {
    position: "absolute",
    left: -1,
    top: 11,
    width: 3,
    height: 78,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  accentPast: {
    backgroundColor: colors.disabled,
  },
  dateColumn: {
    width: 80,
    paddingLeft: 14,
  },
  dayNumber: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "700",
    lineHeight: 30,
  },
  shortDate: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  time: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingLeft: 14,
    paddingTop: 2,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  locationIcon: {
    width: 13,
    height: 13,
  },
  location: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 12,
  },
  badges: {
    flexDirection: "row",
    gap: 6,
    marginTop: 10,
  },
  chevron: {
    width: 15,
    height: 15,
    marginTop: 9,
  },
});
