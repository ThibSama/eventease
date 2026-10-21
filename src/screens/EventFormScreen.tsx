// ============================================================================
// IMPORTS
// ============================================================================

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "../components/BackHeader";
import { EventForm } from "../components/EventForm";
import { useApp } from "../hooks/useApp";
import { geocodeLocation } from "../services/geocoding";
import { colors, spacing } from "../theme";
import type {
  EventFormValues,
  EventLocation,
  NewEvent,
  RootStackParamList,
} from "../types";

// ============================================================================
// TYPES
// ============================================================================

type EventFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "EventForm"
>;

// ============================================================================
// COMPOSANT
// ============================================================================

export function EventFormScreen({ navigation, route }: EventFormScreenProps) {
  const { user, events, addEvent, updateEvent } = useApp();

  // --- Résolution de l'événement --------------------------------------------

  const eventId = route.params?.eventId;

  const existingEvent = eventId
    ? events.find((event) => event.id === eventId)
    : undefined;

  function handleBack() {
    navigation.goBack();
  }

  if (eventId && !existingEvent) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <BackHeader title="Modifier l'événement" onBack={handleBack} />

          <Text style={styles.error}>Événement introuvable.</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- Contrôle du propriétaire ---------------------------------------------

  if (existingEvent && (!user || existingEvent.organizer.userId !== user.id)) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <BackHeader title="Modifier l'événement" onBack={handleBack} />

          <Text style={styles.error}>
            Vous ne pouvez modifier que vos propres événements.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- Résolution du lieu ----------------------------------------------------

  async function resolveLocation(
    locationName: string,
  ): Promise<EventLocation | undefined> {
    const normalizedLocation = locationName.trim();

    if (!normalizedLocation) {
      return undefined;
    }

    if (
      existingEvent?.location &&
      existingEvent.location.name === normalizedLocation
    ) {
      return existingEvent.location;
    }

    const geocodedLocation = await geocodeLocation(normalizedLocation);

    if (geocodedLocation) {
      return geocodedLocation;
    }

    // Le texte saisi est conservé si le géocodage est indisponible.
    return {
      name: normalizedLocation,
    };
  }

  // --- Enregistrement --------------------------------------------------------

  async function handleSubmit(values: EventFormValues) {
    const location = await resolveLocation(values.locationName);

    if (existingEvent) {
      await updateEvent({
        ...existingEvent,
        title: values.title,
        description: values.description,
        date: values.date,
        time: values.time,
        location,
        maxParticipants: values.maxParticipants,
      });

      navigation.goBack();
      return;
    }

    const event: NewEvent = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      date: values.date,
      time: values.time,
      location,
      maxParticipants: values.maxParticipants,
    };

    await addEvent(event);

    navigation.goBack();
  }

  // --- Valeurs initiales -----------------------------------------------------

  const initialValues = existingEvent
    ? {
        title: existingEvent.title,
        description: existingEvent.description,
        date: existingEvent.date,
        time: existingEvent.time,
        locationName: existingEvent.location?.name ?? "",
        maxParticipants: existingEvent.maxParticipants,
      }
    : undefined;

  // --- Rendu -----------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <BackHeader
            title={
              existingEvent ? "Modifier l'événement" : "Créer un événement"
            }
            onBack={handleBack}
          />

          <EventForm
            initialValues={initialValues}
            currentParticipantCount={existingEvent?.participantIds.length ?? 0}
            submitLabel={
              existingEvent
                ? "Enregistrer les modifications"
                : "Créer l’événement"
            }
            onSubmit={handleSubmit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: spacing.screen + 2,
    paddingBottom: 24,
  },
  error: {
    marginTop: 32,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});
