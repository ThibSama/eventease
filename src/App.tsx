// ============================================================================
// IMPORTS
// ============================================================================

import {
  DarkTheme,
  NavigationContainer,
  type Theme,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LocaleConfig } from "react-native-calendars";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppProvider } from "./context/AppContext";
import { AppNavigator } from "./navigation/AppNavigator";
import { colors } from "./theme";

// ============================================================================
// LOCALE DU CALENDRIER
// ============================================================================

// La configuration est centralisée ici pour garder tous les calendriers en français.
LocaleConfig.locales.fr = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avr.",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  // Initiales affichées dans l'en-tête des calendriers, comme sur les maquettes.
  dayNamesShort: ["D", "L", "M", "M", "J", "V", "S"],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";

// ============================================================================
// THÈME DE NAVIGATION
// ============================================================================

// Fond sombre commun pour éviter les flashs clairs pendant les transitions.
const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
  },
};

// ============================================================================
// COMPOSANT
// ============================================================================

export function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={navigationTheme}>
          <StatusBar style="light" />

          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
