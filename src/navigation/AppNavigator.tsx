// ============================================================================
// IMPORTS
// ============================================================================

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, type ImageSource } from "expo-image";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { useApp } from "../hooks/useApp";
import { AuthScreen } from "../screens/AuthScreen";
import { CalendarScreen } from "../screens/CalendarScreen";
import { EventDetailsScreen } from "../screens/EventDetailsScreen";
import { EventFormScreen } from "../screens/EventFormScreen";
import { EventsScreen } from "../screens/EventsScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { colors } from "../theme";
import type { AppTabParamList, RootStackParamList } from "../types";

// ============================================================================
// CONSTANTS
// ============================================================================

const TAB_ICONS: Record<
  keyof AppTabParamList,
  {
    active: ImageSource;
    inactive: ImageSource;
  }
> = {
  Home: {
    active: require("../assets/images/design/tab-home-active.svg"),
    inactive: require("../assets/images/design/tab-home.svg"),
  },
  Events: {
    active: require("../assets/images/design/tab-events-active.svg"),
    inactive: require("../assets/images/design/tab-events.svg"),
  },
  Calendar: {
    active: require("../assets/images/design/tab-calendar-active.svg"),
    inactive: require("../assets/images/design/tab-calendar.svg"),
  },
  // La maquette ne fournit pas de variante active : elle est teintée à l'affichage.
  Profile: {
    active: require("../assets/images/design/tab-profile.svg"),
    inactive: require("../assets/images/design/tab-profile.svg"),
  },
};

// ============================================================================
// NAVIGATEURS
// ============================================================================

const Stack = createNativeStackNavigator<RootStackParamList>();

const Tab = createBottomTabNavigator<AppTabParamList>();

// --- Onglets principaux -------------------------------------------------------

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        sceneStyle: styles.scene,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ focused, color }) => (
          <Image
            source={
              focused
                ? TAB_ICONS[route.name].active
                : TAB_ICONS[route.name].inactive
            }
            tintColor={route.name === "Profile" ? color : undefined}
            style={styles.tabIcon}
            contentFit="contain"
          />
        ),
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Accueil" }}
      />

      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: "Événements" }}
      />

      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ title: "Calendrier" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profil" }}
      />
    </Tab.Navigator>
  );
}

// --- Navigation racine --------------------------------------------------------

export function AppNavigator() {
  const { user, loading } = useApp();

  // --- Chargement initial ----------------------------------------------------

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // --- Navigation selon la session ------------------------------------------

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: styles.scene,
      }}>
      {user ? (
        <>
          <Stack.Screen name="AppTabs" component={AppTabs} />

          <Stack.Screen name="EventDetails" component={EventDetailsScreen} />

          <Stack.Screen name="EventForm" component={EventFormScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
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
    backgroundColor: colors.background,
  },
  scene: {
    backgroundColor: colors.background,
  },
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  tabBarLabel: {
    fontSize: 10,
    lineHeight: 14,
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
});
