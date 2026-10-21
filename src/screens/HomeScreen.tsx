// ============================================================================
// IMPORTS
// ============================================================================

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../components/AppButton";
import { EventCard } from "../components/EventCard";
import { useApp } from "../hooks/useApp";
import { useEventWeather } from "../hooks/useEventWeather";
import { useLocation } from "../hooks/useLocation";
import { colors, radius, spacing } from "../theme";
import type { AppTabParamList, RootStackParamList } from "../types";
import { formatDistance } from "../utils/distance";
import {
  formatCountdown,
  formatDayMonth,
  getEventCoordinates,
  getEventDistanceKm,
  getShortLocationName,
  getWeatherSymbol,
} from "../utils/eventDisplay";
import { isEventPast, sortEventsChronologically } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Home">,
  NativeStackScreenProps<RootStackParamList>
>;

// ============================================================================
// CONSTANTES
// ============================================================================

const FOLLOWING_EVENTS_LIMIT = 3;

// ============================================================================
// COMPOSANT
// ============================================================================

export function HomeScreen({ navigation }: HomeScreenProps) {
  const { user, events } = useApp();

  // --- Localisation utilisateur ---------------------------------------------

  const { coordinates } = useLocation();

  // --- Événements à venir ----------------------------------------------------

  const upcomingEvents = events
    .filter((event) => !isEventPast(event.date, event.time))
    .sort(sortEventsChronologically);

  const nextEvent = upcomingEvents[0] ?? null;

  const followingEvents = upcomingEvents.slice(1, 1 + FOLLOWING_EVENTS_LIMIT);

  const joinedCount = user
    ? upcomingEvents.filter((event) => event.participantIds.includes(user.id))
        .length
    : 0;

  const nextEventJoined = Boolean(
    nextEvent && user && nextEvent.participantIds.includes(user.id),
  );

  // --- Prochain événement : distance et météo -------------------------------

  const nextEventCoordinates = nextEvent
    ? getEventCoordinates(nextEvent)
    : null;

  const nextEventDistance = nextEvent
    ? getEventDistanceKm(nextEvent, coordinates)
    : null;

  // La météo est un bonus : son absence n'empêche jamais l'affichage de la carte.
  const { weather } = useEventWeather({
    date: nextEvent?.date ?? "",
    latitude: nextEventCoordinates?.latitude,
    longitude: nextEventCoordinates?.longitude,
    enabled: nextEvent !== null,
  });

  const nextEventMeta = nextEvent
    ? [
        nextEvent.location ? getShortLocationName(nextEvent) : null,
        nextEventDistance !== null ? formatDistance(nextEventDistance) : null,
        weather ? `${Math.round(weather.maxTemperature)}°C` : null,
      ]
        .filter(Boolean)
        .join("  ·  ")
    : "";

  const countdown = nextEvent ? formatCountdown(nextEvent.date) : null;

  // --- Navigation ------------------------------------------------------------

  function handleOpenEvent(id: string) {
    navigation.navigate("EventDetails", { eventId: id });
  }

  function handleOpenNextEvent() {
    if (nextEvent) {
      handleOpenEvent(nextEvent.id);
    }
  }

  function handleSeeAll() {
    navigation.navigate("Events");
  }

  function handleAddEvent() {
    navigation.navigate("EventForm");
  }

  // --- Rendu -----------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.brand}>
          Event <Text style={styles.brandAccent}>Ease</Text>
        </Text>

        <Text style={styles.sectionLabel}>VUE D’ENSEMBLE</Text>

        {/* --- Prochain événement ------------------------------------------ */}

        {nextEvent ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Ouvrir ${nextEvent.title}`}
            onPress={handleOpenNextEvent}
            style={({ pressed }) => [
              styles.featured,
              pressed && styles.pressed,
            ]}>
            <Image
              source={require("../assets/images/design/home-next-event.svg")}
              style={styles.featuredIllustration}
              contentFit="cover"
            />

            <View style={styles.featuredBadges}>
              <View style={styles.nextBadge}>
                <Text style={styles.nextBadgeText}>PROCHAIN ÉVÉNEMENT</Text>
              </View>

              {countdown ? (
                <View style={styles.countdownBadge}>
                  <Text style={styles.countdownText}>{countdown}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.featuredDate}>
              {formatDayMonth(nextEvent.date)}
            </Text>

            <Text style={styles.featuredTime}>{nextEvent.time}</Text>

            <Text style={styles.featuredTitle} numberOfLines={1}>
              {nextEvent.title}
            </Text>

            <View style={styles.featuredMetaRow}>
              <Text style={styles.featuredMeta} numberOfLines={1}>
                {nextEventMeta}
              </Text>

              {weather?.condition === "Ciel dégagé" ? (
                <Image
                  source={require("../assets/images/design/icon-weather.svg")}
                  style={styles.weatherIcon}
                  contentFit="contain"
                />
              ) : weather ? (
                <Text style={styles.weatherSymbol}>
                  {getWeatherSymbol(weather.condition)}
                </Text>
              ) : null}
            </View>

            <View style={styles.participationRow}>
              <View
                style={[
                  styles.participationDot,
                  nextEventJoined && styles.participationDotJoined,
                ]}
              />

              <Text
                style={[
                  styles.participationText,
                  nextEventJoined && styles.participationTextJoined,
                ]}>
                {nextEventJoined ? "Vous participez" : "À venir"}
              </Text>
            </View>
          </Pressable>
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Aucun événement à venir</Text>

            <Text style={styles.emptyText}>
              Créez votre prochain événement pour le retrouver ici.
            </Text>

            <AppButton label="Créer un événement" onPress={handleAddEvent} />
          </View>
        )}

        {/* --- Événements suivants ----------------------------------------- */}

        {followingEvents.length > 0 ? (
          <>
            <View style={styles.listHeader}>
              <Text style={styles.listLabel}>ÉVÉNEMENTS À VENIR</Text>

              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={handleSeeAll}>
                <Text style={styles.seeAll}>Voir tout →</Text>
              </Pressable>
            </View>

            <View style={styles.list}>
              {followingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  userCoordinates={coordinates}
                  dateFormat="short"
                  onPress={handleOpenEvent}
                />
              ))}
            </View>
          </>
        ) : null}

        {/* --- Suivi des participations ------------------------------------ */}

        {upcomingEvents.length > 0 ? (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              {upcomingEvents.length} événement
              {upcomingEvents.length > 1 ? "s" : ""} à venir · {joinedCount}{" "}
              rejoint{joinedCount > 1 ? "s" : ""}
            </Text>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(joinedCount / upcomingEvents.length) * 100}%` },
                ]}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: spacing.screen,
    paddingTop: 18,
    paddingBottom: 32,
  },
  pressed: {
    opacity: 0.9,
  },
  brand: {
    marginLeft: 2,
    color: colors.text,
    fontSize: 25,
    fontWeight: "700",
  },
  brandAccent: {
    color: colors.primary,
  },
  sectionLabel: {
    marginTop: 22,
    marginBottom: 12,
    marginLeft: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  featured: {
    height: 238,
    overflow: "hidden",
    marginHorizontal: -1,
    paddingHorizontal: 14,
    paddingTop: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
  },
  featuredIllustration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  featuredBadges: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nextBadge: {
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 9,
    borderRadius: radius.badge,
    backgroundColor: colors.surfaceRaised,
  },
  nextBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  countdownBadge: {
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 7,
    borderRadius: radius.badge,
    backgroundColor: colors.primarySoft,
  },
  countdownText: {
    color: "#31bdff",
    fontSize: 10,
    fontWeight: "700",
  },
  featuredDate: {
    marginTop: 18,
    color: colors.text,
    fontSize: 30,
    fontWeight: "700",
  },
  featuredTime: {
    marginTop: -4,
    color: colors.text,
    fontSize: 37,
    fontWeight: "700",
  },
  featuredTitle: {
    marginTop: 8,
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  featuredMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  featuredMeta: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 13,
  },
  weatherIcon: {
    width: 20,
    height: 20,
  },
  weatherSymbol: {
    color: colors.warning,
    fontSize: 16,
  },
  participationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  participationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00c6b2",
  },
  participationDotJoined: {
    backgroundColor: colors.primary,
  },
  participationText: {
    color: "#00d5be",
    fontSize: 12,
    fontWeight: "700",
  },
  participationTextJoined: {
    color: colors.primary,
  },
  emptyCard: {
    gap: 12,
    padding: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 36,
    marginBottom: 12,
    marginHorizontal: 2,
  },
  listLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  seeAll: {
    color: "#1db5ff",
    fontSize: 12,
    fontWeight: "700",
  },
  list: {
    gap: 12,
  },
  summary: {
    marginTop: 28,
    marginHorizontal: 2,
  },
  summaryText: {
    color: "#91aabc",
    fontSize: 13,
  },
  progressTrack: {
    height: 3,
    marginTop: 17,
    borderRadius: 1,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#0db9fb",
  },
});
