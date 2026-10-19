// ============================================================================
// IMPORTS
// ============================================================================

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";

import { EventForm } from "../components/EventForm";
import { useApp } from "../hooks/useApp";
import type { Event, RootStackParamList } from "../types";

// ============================================================================
// TYPES
// ============================================================================

type EventFormScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "EventForm"
>;

type EventFormValues = {
  title: string;
  description: string;
  date: string;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function EventFormScreen({ navigation }: EventFormScreenProps) {
  const { addEvent } = useApp();

  async function handleSubmit(values: EventFormValues) {
    const event: Event = {
      id: Date.now().toString(),
      title: values.title,
      description: values.description,
      date: values.date,
      participated: false,
    };

    await addEvent(event);

    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <EventForm onSubmit={handleSubmit} />
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
});
