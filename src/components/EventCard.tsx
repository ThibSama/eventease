// ============================================================================
// IMPORTS
// ============================================================================

import { Button, StyleSheet, Text, View } from "react-native";

import type { Event } from "../types";

// ============================================================================
// TYPES
// ============================================================================

type EventCardProps = {
  event: Event;
  onEdit: (id: string) => void;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function EventCard({ event, onEdit }: EventCardProps) {
  function handleEdit() {
    onEdit(event.id);
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.date}>{event.date}</Text>

      <Text style={styles.description}>{event.description}</Text>

      <Text style={styles.participation}>
        {event.participated ? "Participé" : "Non participé"}
      </Text>

      <View style={styles.actions}>
        <Button title="Modifier" onPress={handleEdit} />
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
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
  },
  participation: {
    fontWeight: "500",
    marginBottom: 12,
  },
  actions: {
    alignItems: "flex-start",
  },
});
