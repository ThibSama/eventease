// ============================================================================
// IMPORTS
// ============================================================================

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useApp } from "../hooks/useApp";
import { AuthScreen } from "../screens/AuthScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { EventFormScreen } from "../screens/EventFormScreen";
import { EventsScreen } from "../screens/EventsScreen";
import type { RootStackParamList } from "../types";

// ============================================================================
// NAVIGATOR
// ============================================================================

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Events"
            component={EventsScreen}
            options={{ title: "EventEase" }}
          />

          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ title: "Calendrier" }}
          />

          <Stack.Screen
            name="EventForm"
            component={EventFormScreen}
            options={({ route }) => ({
              title: route.params?.eventId
                ? "Modifier l'événement"
                : "Nouvel événement",
            })}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
