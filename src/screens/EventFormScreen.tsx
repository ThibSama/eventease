// ============================================================================
// IMPORTS
// ============================================================================

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";

import { EventForm } from "../components/EventForm";
import { useApp } from "../hooks/useApp";
import { geocodeLocation } from "../services/geocoding";
import type {
  Event,
  EventFormValues,
  EventLocation,
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
  const { events, addEvent, updateEvent } = useApp();

  // --- Résolution de l'événement --------------------------------------------

  const eventId = route.params?.eventId;

  const existingEvent = eventId
    ? events.find((event) => event.id === eventId)
    : undefined;

  if (eventId && !existingEvent) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Événement introuvable.</Text>

        <Button title="Retour" onPress={() => navigation.goBack()} />
      </View>
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
      });

      navigation.goBack();
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      date: values.date,
      time: values.time,
      participated: false,
      location,
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
      }
    : undefined;

  // --- Rendu -----------------------------------------------------------------

  return (
    <View style={styles.container}>
      <EventForm
        initialValues={initialValues}
        submitLabel={
          existingEvent ? "Enregistrer les modifications" : "Créer l'événement"
        }
        onSubmit={handleSubmit}
      />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  error: {
    textAlign: "center",
    marginBottom: 16,
  },
});
