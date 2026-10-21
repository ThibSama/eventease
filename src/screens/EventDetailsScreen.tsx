// ============================================================================
// IMPORTS
// ============================================================================

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../components/AppButton";
import { BackHeader } from "../components/BackHeader";
import { Badge } from "../components/Badge";
import { useApp } from "../hooks/useApp";
import { useEventWeather } from "../hooks/useEventWeather";
import { useLocation } from "../hooks/useLocation";
import { colors, radius, spacing } from "../theme";
import type { RootStackParamList } from "../types";
import { formatDistance } from "../utils/distance";
import {
  getEventCoordinates,
  getEventDistanceKm,
  getWeatherSymbol,
} from "../utils/eventDisplay";
import { formatEventDateTime, isEventPast } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type EventDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "EventDetails"
>;

// ============================================================================
// COMPOSANT
// ============================================================================

export function EventDetailsScreen({
  navigation,
  route,
}: EventDetailsScreenProps) {
  const { user, events, deleteEvent, toggleParticipated } = useApp();

  // --- Résolution de l'événement --------------------------------------------

  const event = events.find((item) => item.id === route.params.eventId);

  const isOrganizer = Boolean(
    event && user && event.organizer.userId === user.id,
  );

  const isParticipating = Boolean(
    event && user && event.participantIds.includes(user.id),
  );

  // --- Localisation utilisateur ---------------------------------------------

  const { coordinates, status: locationStatus } = useLocation();

  // --- Confirmation de suppression ------------------------------------------

  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // --- Météo ----------------------------------------------------------------

  const eventPast = event ? isEventPast(event.date, event.time) : true;

  const eventCoordinates = event ? getEventCoordinates(event) : null;

  // La météo reste optionnelle et n'est chargée que pour les événements futurs.
  const { weather, status: weatherStatus } = useEventWeather({
    date: event?.date ?? "",
    latitude: eventCoordinates?.latitude,
    longitude: eventCoordinates?.longitude,
    enabled: !eventPast,
  });

  // --- Navigation et actions -------------------------------------------------

  function handleBack() {
    navigation.goBack();
  }

  function handleEdit() {
    if (!event || !isOrganizer) {
      return;
    }

    navigation.navigate("EventForm", { eventId: event.id });
  }

  async function handleToggleParticipated() {
    if (event) {
      await toggleParticipated(event.id);
    }
  }

  async function handleDelete() {
    if (!event || !isOrganizer) {
      return;
    }

    // Un premier appui arme la suppression, le second la confirme.
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }

    navigation.goBack();
    await deleteEvent(event.id);
  }

  function handleCancelDelete() {
    setConfirmingDelete(false);
  }

  // --- Événement introuvable -------------------------------------------------

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <BackHeader title="Détails de l’événement" onBack={handleBack} />

          <Text style={styles.notFound}>Événement introuvable.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --- Participants et capacité ---------------------------------------------

  const participantCount = event.participantIds.length;

  const eventIsFull =
    event.maxParticipants !== undefined &&
    participantCount >= event.maxParticipants;

  const participantWord = participantCount > 1 ? "participants" : "participant";

  const capacityLabel =
    event.maxParticipants !== undefined
      ? `${participantCount} / ${event.maxParticipants} place${event.maxParticipants > 1 ? "s" : ""}`
      : `${participantCount} ${participantWord} · places illimitées`;

  // --- Distance --------------------------------------------------------------

  const distance = getEventDistanceKm(event, coordinates);

  let distanceLabel: string | null = null;

  if (distance !== null) {
    distanceLabel = `${formatDistance(distance)} de vous`;
  } else if (event.location && !eventCoordinates) {
    distanceLabel = "Coordonnées du lieu indisponibles";
  } else if (event.location && locationStatus === "loading") {
    distanceLabel = "Localisation en cours…";
  } else if (event.location) {
    distanceLabel = "Votre position est indisponible";
  }

  // --- Détail météo ----------------------------------------------------------

  let weatherDetail: string | null = null;

  if (weatherStatus === "available" && weather) {
    weatherDetail = [
      weather.condition,
      `${Math.round(weather.minTemperature)} à ${Math.round(weather.maxTemperature)}°C`,
      weather.precipitationProbability !== null
        ? `pluie ${Math.round(weather.precipitationProbability)} %`
        : null,
    ]
      .filter(Boolean)
      .join(" · ");
  } else if (weatherStatus === "out-of-range") {
    weatherDetail = "Prévisions disponibles à l'approche de l'événement.";
  } else if (weatherStatus === "unavailable") {
    weatherDetail = "Météo indisponible.";
  }

  // --- Libellé de participation ---------------------------------------------

  let participationLabel = "PARTICIPATION OUVERTE";

  if (isParticipating) {
    participationLabel = eventPast ? "VOUS AVEZ PARTICIPÉ" : "VOUS PARTICIPEZ";
  } else if (eventPast) {
    participationLabel = "NON PARTICIPÉ";
  } else if (eventIsFull) {
    participationLabel = "ÉVÉNEMENT COMPLET";
  }

  // --- Rendu -----------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <BackHeader title="Détails de l’événement" onBack={handleBack} />

        <View style={[styles.cover, eventPast && styles.coverPast]}>
          <Image
            source={
              eventPast
                ? require("../assets/images/design/cover-past.svg")
                : require("../assets/images/design/cover-upcoming.svg")
            }
            style={styles.coverImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.statusRow}>
          <Text
            style={[
              styles.participation,
              ((eventPast && !isParticipating) ||
                (eventIsFull && !isParticipating)) &&
                styles.participationMuted,
            ]}>
            {participationLabel}
          </Text>

          <Badge
            label={eventPast ? "Passé" : "À venir"}
            tone={eventPast ? "past" : "upcoming"}
          />
        </View>

        <Text style={styles.title}>{event.title}</Text>

        <Text style={styles.info}>
          {formatEventDateTime(event.date, event.time)}
        </Text>

        {event.location ? (
          <Text style={styles.info}>{event.location.name}</Text>
        ) : (
          <Text style={styles.info}>Lieu non renseigné</Text>
        )}

        <View style={styles.organizer}>
          <Text style={styles.metaLabel}>ORGANISÉ PAR</Text>

          <Text style={styles.organizerName}>@{event.organizer.username}</Text>
        </View>

        <View style={styles.capacity}>
          <Text style={styles.metaLabel}>PARTICIPANTS</Text>

          <Text style={styles.capacityValue}>{capacityLabel}</Text>
        </View>

        {distanceLabel || weatherStatus !== "idle" ? (
          <View style={styles.distanceRow}>
            <Text style={[styles.info, styles.distance]}>
              {distanceLabel ?? ""}
            </Text>

            {weatherStatus === "available" && weather ? (
              <View style={styles.weatherChip}>
                <Text style={styles.weatherChipText}>
                  {getWeatherSymbol(weather.condition)}
                  {"  "}
                  {Math.round(weather.maxTemperature)}°C
                </Text>
              </View>
            ) : null}

            {weatherStatus === "loading" ? (
              <View style={styles.weatherChip}>
                <Text style={styles.weatherChipLoading}>Météo…</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {weatherDetail ? (
          <Text style={styles.weatherDetail}>{weatherDetail}</Text>
        ) : null}

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Description</Text>

        <Text style={styles.description}>{event.description}</Text>

        {/* --- Actions ------------------------------------------------------ */}

        <View style={styles.actions}>
          {eventPast ? (
            <>
              <AppButton label="Événement passé" variant="inactive" />

              <Text style={styles.pastHint}>
                Cet événement ne peut plus être rejoint.
              </Text>
            </>
          ) : eventIsFull && !isParticipating ? (
            <AppButton label="Événement complet" variant="inactive" />
          ) : (
            <AppButton
              label={
                isParticipating
                  ? "Annuler ma participation"
                  : "Rejoindre l’événement"
              }
              variant={isParticipating ? "secondary" : "primary"}
              onPress={handleToggleParticipated}
            />
          )}

          {isOrganizer ? (
            confirmingDelete ? (
              <>
                <Text style={styles.deleteHint}>
                  Supprimer définitivement cet événement ?
                </Text>

                <View style={styles.secondaryActions}>
                  <View style={styles.secondaryAction}>
                    <AppButton
                      label="Annuler"
                      variant="secondary"
                      onPress={handleCancelDelete}
                    />
                  </View>

                  <View style={styles.secondaryAction}>
                    <AppButton
                      label="Supprimer"
                      variant="danger"
                      onPress={handleDelete}
                    />
                  </View>
                </View>
              </>
            ) : (
              <View style={styles.secondaryActions}>
                <View style={styles.secondaryAction}>
                  <AppButton
                    label="Modifier"
                    variant="secondary"
                    onPress={handleEdit}
                  />
                </View>

                <View style={styles.secondaryAction}>
                  <AppButton
                    label="Supprimer"
                    variant="secondary"
                    onPress={handleDelete}
                  />
                </View>
              </View>
            )
          ) : null}
        </View>
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
    flexGrow: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: spacing.screen + 2,
    paddingBottom: 24,
  },
  notFound: {
    marginTop: 32,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  cover: {
    height: 171,
    overflow: "hidden",
    borderRadius: radius.cover,
    backgroundColor: "#152636",
  },
  coverPast: {
    height: 168,
    borderRadius: 15,
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 16,
    paddingLeft: 13,
    paddingRight: 16,
  },
  participation: {
    flex: 1,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "700",
  },
  participationMuted: {
    color: colors.textMuted,
  },
  title: {
    marginTop: 24,
    color: colors.text,
    fontSize: 24,
    fontWeight: "700",
  },
  info: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 14,
  },
  organizer: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  capacity: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
  },
  organizerName: {
    marginTop: 4,
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  capacityValue: {
    marginTop: 4,
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  distance: {
    flex: 1,
  },
  weatherChip: {
    minWidth: 108,
    height: 32,
    marginTop: 6,
    marginRight: 13,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
  },
  weatherChipText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: "700",
  },
  weatherChipLoading: {
    color: colors.textMuted,
    fontSize: 12,
  },
  weatherDetail: {
    marginTop: 8,
    color: colors.textSubtle,
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginTop: 18,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    marginTop: 20,
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  description: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    marginTop: "auto",
    paddingTop: 32,
  },
  pastHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
  deleteHint: {
    color: colors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
  },
});
