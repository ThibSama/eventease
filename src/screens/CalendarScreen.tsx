// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";

import { useApp } from "../hooks/useApp";
import type { Event } from "../types";
import { formatEventDate, getTodayDate } from "../utils/validation";

// ============================================================================
// COMPONENT
// ============================================================================

export function CalendarScreen() {
  const { events } = useApp();

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  const eventsForSelectedDate = events
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.title.localeCompare(b.title));

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

  function handleDayPress(day: DateData) {
    setSelectedDate(day.dateString);
  }

  function renderEvent({ item }: { item: Event }) {
    return (
      <View style={styles.eventCard}>
        <Text style={styles.eventTitle}>{item.title}</Text>

        <Text style={styles.eventDescription}>{item.description}</Text>

        <Text style={styles.participation}>
          {item.participated ? "Participé" : "Non participé"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Calendar
        current={selectedDate}
        firstDay={1}
        markedDates={markedDates}
        onDayPress={handleDayPress}
      />

      <View style={styles.selectedDay}>
        <Text style={styles.selectedDayTitle}>
          {formatEventDate(selectedDate)}
        </Text>

        <Text style={styles.eventCount}>
          {eventsForSelectedDate.length} événement
          {eventsForSelectedDate.length > 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={eventsForSelectedDate}
        keyExtractor={(event) => event.id}
        renderItem={renderEvent}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun événement à cette date.</Text>
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
    padding: 16,
  },
  selectedDay: {
    marginTop: 20,
    marginBottom: 12,
  },
  selectedDayTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventCount: {
    fontSize: 14,
  },
  list: {
    paddingBottom: 24,
  },
  eventCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  eventDescription: {
    marginBottom: 12,
  },
  participation: {
    fontWeight: "500",
  },
  empty: {
    textAlign: "center",
    marginTop: 24,
  },
});
