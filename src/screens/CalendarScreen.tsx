// ============================================================================
// IMPORTS
// ============================================================================

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";

import { EventCard } from "../components/EventCard";
import { useApp } from "../hooks/useApp";
import { useLocation } from "../hooks/useLocation";
import { calendarTheme, colors, radius, spacing } from "../theme";
import type { AppTabParamList, RootStackParamList } from "../types";
import { getIsoWeekNumber } from "../utils/eventDisplay";
import {
  formatEventDate,
  getTodayDate,
  sortEventsChronologically,
} from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type CalendarScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Calendar">,
  NativeStackScreenProps<RootStackParamList>
>;

// ============================================================================
// COMPOSANT
// ============================================================================

export function CalendarScreen({ navigation }: CalendarScreenProps) {
  const { events } = useApp();

  // --- Localisation utilisateur ---------------------------------------------

  const { coordinates } = useLocation();

  // --- Date sélectionnée -----------------------------------------------------

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const weekNumber = getIsoWeekNumber(selectedDate);

  // --- Événements du jour ----------------------------------------------------

  const eventsForSelectedDate = events
    .filter((event) => event.date === selectedDate)
    .sort(sortEventsChronologically);

  // --- Marqueurs du calendrier ----------------------------------------------

  const markedDates: Record<
    string,
    {
      marked?: boolean;
      selected?: boolean;
    }
  > = {};

  for (const event of events) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
      continue;
    }

    markedDates[event.date] = {
      ...markedDates[event.date],
      marked: true,
    };
  }

  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
  };

  // --- Sélection et navigation ----------------------------------------------

  function handleDayPress(day: DateData) {
    setSelectedDate(day.dateString);
  }

  function handleOpenEvent(id: string) {
    navigation.navigate("EventDetails", { eventId: id });
  }

  function handleAddEvent() {
    navigation.navigate("EventForm");
  }

  // --- Rendu -----------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Calendrier</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter un événement"
            onPress={handleAddEvent}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.pressed,
            ]}>
            <Image
              source={require("../assets/images/design/icon-add.svg")}
              style={styles.addIcon}
              contentFit="contain"
            />
          </Pressable>
        </View>

        <Calendar
          style={styles.calendar}
          theme={calendarTheme}
          current={selectedDate}
          firstDay={1}
          markedDates={markedDates}
          onDayPress={handleDayPress}
        />

        <View style={styles.selectedDay}>
          <Text style={styles.selectedDayTitle}>
            {formatEventDate(selectedDate)}
          </Text>

          {weekNumber !== null ? (
            <Text style={styles.weekNumber}>SEMAINE {weekNumber}</Text>
          ) : null}
        </View>

        <Text style={styles.eventCount}>
          {eventsForSelectedDate.length} ÉVÉNEMENT
          {eventsForSelectedDate.length > 1 ? "S" : ""}
        </Text>

        <View style={styles.list}>
          {eventsForSelectedDate.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              userCoordinates={coordinates}
              onPress={handleOpenEvent}
            />
          ))}
        </View>

        {eventsForSelectedDate.length === 0 ? (
          <Text style={styles.empty}>Aucun événement à cette date.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: spacing.screen,
    paddingTop: 22,
    paddingBottom: 32,
  },
  pressed: {
    opacity: 0.85,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: {
    marginLeft: 2,
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  addIcon: {
    width: 22,
    height: 22,
  },
  calendar: {
    paddingTop: 8,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.panel,
    overflow: "hidden",
  },
  selectedDay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginHorizontal: 2,
  },
  selectedDayTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "700",
  },
  weekNumber: {
    color: "#81a1b6",
    fontSize: 11,
    fontWeight: "700",
  },
  eventCount: {
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 2,
    color: "#a7c4d4",
    fontSize: 11,
    fontWeight: "700",
  },
  list: {
    gap: 12,
  },
  empty: {
    marginTop: 12,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});
