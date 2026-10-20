// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";

import type { EventFormValues } from "../types";
import {
  EVENT_DESCRIPTION_MAX_LENGTH,
  EVENT_TITLE_MAX_LENGTH,
  formatEventDate,
  getTodayDate,
  isValidEventDate,
  isValidEventDescription,
  isValidEventTitle,
} from "../utils/validation";
// ============================================================================
// TYPES
// ============================================================================

type EventFormProps = {
  initialValues?: EventFormValues;
  submitLabel?: string;
  onSubmit: (values: EventFormValues) => Promise<void>;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function EventForm({
  initialValues,
  submitLabel = "Enregistrer",
  onSubmit,
}: EventFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [date, setDate] = useState(initialValues?.date ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const today = getTodayDate();

  function handleDateSelect(day: DateData) {
    setDate(day.dateString);
    setError(null);
  }

  async function handleSubmit() {
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();

    if (!isValidEventTitle(normalizedTitle)) {
      setError("Le titre doit contenir entre 3 et 80 caractères.");
      return;
    }

    if (!isValidEventDescription(normalizedDescription)) {
      setError("La description doit contenir entre 3 et 500 caractères.");
      return;
    }

    if (!date) {
      setError("Veuillez sélectionner une date.");
      return;
    }

    if (!isValidEventDate(date)) {
      setError("La date de l'événement ne peut pas être passée.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        title: normalizedTitle,
        description: normalizedDescription,
        date,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View>
      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Titre de l'événement"
        maxLength={EVENT_TITLE_MAX_LENGTH}
      />
      <Text style={styles.helper}>
        {title.length}/{EVENT_TITLE_MAX_LENGTH}
      </Text>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.description]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        maxLength={EVENT_DESCRIPTION_MAX_LENGTH}
        multiline
      />
      <Text style={styles.helper}>
        {description.length}/{EVENT_DESCRIPTION_MAX_LENGTH}
      </Text>
      <Text style={styles.label}>Date</Text>
      <Calendar
        minDate={today}
        firstDay={1}
        onDayPress={handleDateSelect}
        markedDates={
          date
            ? {
                [date]: {
                  selected: true,
                },
              }
            : undefined
        }
      />

      {date ? (
        <Text style={styles.selectedDate}>
          Date sélectionnée : {formatEventDate(date)}
        </Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        title={submitLabel}
        onPress={handleSubmit}
        disabled={submitting}
      />
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  label: {
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  description: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  helper: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: "right",
  },
  selectedDate: {
    marginTop: 12,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  error: {
    marginBottom: 16,
    textAlign: "center",
  },
});
