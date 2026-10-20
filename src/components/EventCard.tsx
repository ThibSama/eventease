// ============================================================================
// IMPORTS
// ============================================================================

import { Button, StyleSheet, Text, View } from "react-native";

import type { Event } from "../types";
import { formatEventDateTime, isEventPast } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type EventCardProps = {
  event: Event;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleParticipated: (id: string) => void;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function EventCard({
  event,
  onEdit,
  onDelete,
  onToggleParticipated,
}: EventCardProps) {
  const eventPast = isEventPast(event.date, event.time);

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
        <Text style={styles.location}>Lieu : {event.location.name}</Text>
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
    marginBottom: 8,
    fontWeight: "500",
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
