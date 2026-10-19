// ============================================================================
// IMPORTS
// ============================================================================

import { Button, StyleSheet, Text, View } from "react-native";

import { useApp } from "../hooks/useApp";

// ============================================================================
// COMPONENT
// ============================================================================

export function EventsScreen() {
  const { user, logout } = useApp();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes événements</Text>

      <Text style={styles.email}>Connecté avec {user?.email}</Text>

      <Button title="Déconnexion" onPress={logout} />
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
});
