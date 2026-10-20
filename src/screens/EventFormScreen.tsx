// ============================================================================
// IMPORTS
// ============================================================================

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";

import { EventForm } from "../components/EventForm";
import { useApp } from "../hooks/useApp";
import type { Event, EventFormValues, RootStackParamList } from "../types";

// ============================================================================
// TYPES
// ============================================================================

type EventFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "EventForm"
>;

// ============================================================================
// COMPONENT
// ============================================================================

export function EventFormScreen({ navigation, route }: EventFormScreenProps) {
  const { events, addEvent, updateEvent } = useApp();

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

  async function handleSubmit(values: EventFormValues) {
    if (existingEvent) {
      await updateEvent({
        ...existingEvent,
        ...values,
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
    };

    await addEvent(event);

    navigation.goBack();
  }

  const initialValues = existingEvent
    ? {
        title: existingEvent.title,
        description: existingEvent.description,
        date: existingEvent.date,
        time: existingEvent.time,
      }
    : undefined;

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
