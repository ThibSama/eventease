// ============================================================================
// IMPORTS
// ============================================================================

import { NavigationContainer } from "@react-navigation/native";
import { LocaleConfig } from "react-native-calendars";

import { AppProvider } from "./context/AppContext";
import { AppNavigator } from "./navigation/AppNavigator";

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
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = "fr";

// ============================================================================
// COMPOSANT
// ============================================================================

export function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
