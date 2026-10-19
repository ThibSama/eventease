// ============================================================================
// IMPORTS
// ============================================================================

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";

import { useApp } from "../hooks/useApp";
import type { RootStackParamList } from "../types";

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes événements</Text>

      <Text style={styles.email}>Connecté avec {user?.email}</Text>

      <Text style={styles.count}>
        {events.length} événement{events.length > 1 ? "s" : ""}
      </Text>

      <View style={styles.actions}>
        <Button title="Ajouter un événement" onPress={handleAddEvent} />

        <Button title="Déconnexion" onPress={logout} />
      </View>
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
    marginBottom: 8,
  },
  count: {
    marginBottom: 24,
  },
  actions: {
    gap: 12,
  },
});
