// ============================================================================
// IMPORTS
// ============================================================================

import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EventCard } from "../components/EventCard";
import { useApp } from "../hooks/useApp";
import { useLocation } from "../hooks/useLocation";
import { colors, radius, spacing } from "../theme";
import type { AppTabParamList, Event, RootStackParamList } from "../types";
import { formatMonthHeader } from "../utils/eventDisplay";
import { isEventPast, sortEventsChronologically } from "../utils/validation";

// ============================================================================
// TYPES
// ============================================================================

type EventsScreenProps = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, "Events">,
  NativeStackScreenProps<RootStackParamList>
>;

type EventFilter = "all" | "upcoming" | "past";

type MonthSection = {
  key: string;
  title: string;
  events: Event[];
};

// ============================================================================
// CONSTANTS
// ============================================================================

const FILTERS: { value: EventFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "upcoming", label: "À venir" },
  { value: "past", label: "Passés" },
];

// Position de la ligne chronologique, dans la marge à gauche des cartes.
const TIMELINE_LEFT = -9;

const DOT_TOP = 22;

const EMPTY_MESSAGES: Record<EventFilter, string> = {
  all: "Aucun événement pour le moment.",
  upcoming: "Aucun événement à venir.",
  past: "Aucun événement passé.",
};

// ============================================================================
// UTILITAIRES
// ============================================================================

function groupEventsByMonth(events: Event[]) {
  const sections: MonthSection[] = [];

  for (const event of events) {
    const key = event.date.slice(0, 7);

    const lastSection = sections[sections.length - 1];

    // Les événements arrivent triés : un nouveau mois ouvre une nouvelle section.
    if (lastSection?.key === key) {
      lastSection.events.push(event);
    } else {
      sections.push({
        key,
        title: formatMonthHeader(event.date),
        events: [event],
      });
    }
  }

  return sections;
}

// ============================================================================
// COMPOSANT
// ============================================================================

export function EventsScreen({ navigation }: EventsScreenProps) {
  const { events } = useApp();

  // --- Localisation utilisateur ---------------------------------------------

  const { coordinates } = useLocation();

  // --- Filtre ----------------------------------------------------------------

  const [filter, setFilter] = useState<EventFilter>("all");

  // --- Tri, filtrage et regroupement ----------------------------------------

  const visibleEvents = [...events]
    .filter((event) => {
      if (filter === "all") {
        return true;
      }

      const eventPast = isEventPast(event.date, event.time);

      return filter === "past" ? eventPast : !eventPast;
    })
    .sort(sortEventsChronologically);

  const sections = groupEventsByMonth(visibleEvents);

  const lastEventId = visibleEvents[visibleEvents.length - 1]?.id;

  // --- Navigation ------------------------------------------------------------

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
          <Text style={styles.title}>Événements</Text>

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

        <View style={styles.filters}>
          {FILTERS.map((item) => {
            const selected = item.value === filter;

            return (
              <Pressable
                key={item.value}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFilter(item.value)}
                style={[styles.filter, selected && styles.filterSelected]}>
                <Text
                  style={[
                    styles.filterText,
                    selected && styles.filterTextSelected,
                  ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {sections.length === 0 ? (
          <Text style={styles.empty}>{EMPTY_MESSAGES[filter]}</Text>
        ) : null}

        {sections.map((section, sectionIndex) => (
          <View key={section.key}>
            <View style={styles.monthHeader}>
              {/* La ligne chronologique traverse les en-têtes entre deux mois. */}
              {sectionIndex > 0 ? <View style={styles.timelineFull} /> : null}

              <Text style={styles.monthTitle}>{section.title}</Text>
            </View>

            {section.events.map((event, eventIndex) => {
              const isFirst = sectionIndex === 0 && eventIndex === 0;

              const isLast = event.id === lastEventId;

              return (
                <View key={event.id} style={styles.timelineRow}>
                  {!isLast ? (
                    <View
                      style={[
                        styles.timelineSegment,
                        isFirst && styles.timelineSegmentFirst,
                      ]}
                    />
                  ) : null}

                  {isLast && !isFirst ? (
                    <View style={styles.timelineSegmentLast} />
                  ) : null}

                  <View style={styles.timelineDot} />

                  <EventCard
                    event={event}
                    userCoordinates={coordinates}
                    onPress={handleOpenEvent}
                  />
                </View>
              );
            })}
          </View>
        ))}
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
  filters: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    marginLeft: 2,
  },
  filter: {
    minWidth: 64,
    height: 24,
    justifyContent: "center",
    paddingHorizontal: 9,
    borderRadius: radius.badge,
    borderWidth: 1,
    borderColor: colors.surfaceRaised,
    backgroundColor: colors.surfaceRaised,
  },
  filterSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  filterText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
  },
  filterTextSelected: {
    color: colors.primary,
  },
  empty: {
    marginTop: 48,
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  monthHeader: {
    paddingTop: 30,
    paddingBottom: 14,
  },
  monthTitle: {
    marginLeft: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  timelineRow: {
    paddingBottom: 12,
  },
  timelineFull: {
    position: "absolute",
    left: TIMELINE_LEFT,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.timeline,
  },
  timelineSegment: {
    position: "absolute",
    left: TIMELINE_LEFT,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.timeline,
  },
  timelineSegmentFirst: {
    top: DOT_TOP,
  },
  timelineSegmentLast: {
    position: "absolute",
    left: TIMELINE_LEFT,
    top: 0,
    height: DOT_TOP,
    width: 2,
    backgroundColor: colors.timeline,
  },
  timelineDot: {
    position: "absolute",
    left: TIMELINE_LEFT - 5,
    top: DOT_TOP,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#08b6fd",
  },
});
