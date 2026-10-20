// ============================================================================
// IMPORTS
// ============================================================================

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

import { EventCard } from "../components/EventCard";
import { useApp } from "../hooks/useApp";
import type { Event, RootStackParamList } from "../types";

// ============================================================================
// TYPES
// ============================================================================

type EventsScreenProps = NativeStackScreenProps<RootStackParamList, "Events">;

// ============================================================================
// COMPONENT
// ============================================================================

export function EventsScreen({ navigation }: EventsScreenProps) {
  const { events, user, logout } = useApp();

  function handleAddEvent() {
    navigation.navigate("EventForm");
  }

  function handleEditEvent(id: string) {
    navigation.navigate("EventForm", {
      eventId: id,
    });
  }

  function renderEvent({ item }: { item: Event }) {
    return <EventCard event={item} onEdit={handleEditEvent} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes événements</Text>

      <Text style={styles.email}>Connecté avec {user?.email}</Text>

      <View style={styles.actions}>
        <Button title="Ajouter un événement" onPress={handleAddEvent} />

        <Button title="Déconnexion" onPress={logout} />
      </View>

      <Text style={styles.count}>
        {events.length} événement{events.length > 1 ? "s" : ""}
      </Text>

      <FlatList
        data={events}
        keyExtractor={(event) => event.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun événement pour le moment.</Text>
        }
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
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  email: {
    marginBottom: 16,
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  count: {
    marginBottom: 12,
    fontWeight: "500",
  },
  list: {
    paddingBottom: 24,
  },
  empty: {
    textAlign: "center",
    marginTop: 32,
  },
});
