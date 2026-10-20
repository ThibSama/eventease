// ============================================================================
// IMPORTS
// ============================================================================

import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";

import type { EventFormValues } from "../types";
import {
  EVENT_DESCRIPTION_MAX_LENGTH,
  EVENT_LOCATION_MAX_LENGTH,
  EVENT_TITLE_MAX_LENGTH,
  formatEventDate,
  getTodayDate,
  isEventPast,
  isValidEventDate,
  isValidEventDescription,
  isValidEventLocation,
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
// CONSTANTS
// ============================================================================

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);

const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

// ============================================================================
// HELPERS
// ============================================================================

function getDefaultTime() {
  const now = new Date();

  const nextHour = new Date(now);

  nextHour.setHours(now.getHours() + 1, 0, 0, 0);

  return {
    hour: String(nextHour.getHours()).padStart(2, "0"),
    minute: "00",
  };
}

// ============================================================================
// COMPONENT
// ============================================================================

export function EventForm({
  initialValues,
  submitLabel = "Enregistrer",
  onSubmit,
}: EventFormProps) {
  const defaultTime = getDefaultTime();

  const [title, setTitle] = useState(initialValues?.title ?? "");

  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );

  const [date, setDate] = useState(initialValues?.date ?? "");

  const [hour, setHour] = useState(
    initialValues?.time?.split(":")[0] ?? defaultTime.hour,
  );

  const [minute, setMinute] = useState(
    initialValues?.time?.split(":")[1] ?? defaultTime.minute,
  );

  const [locationName, setLocationName] = useState(
    initialValues?.locationName ?? "",
  );

  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const today = getTodayDate();

  const time = `${hour}:${minute}`;

  function handleDateSelect(day: DateData) {
    setDate(day.dateString);
    setError(null);
  }

  async function handleSubmit() {
    const normalizedTitle = title.trim();

    const normalizedDescription = description.trim();

    const normalizedLocation = locationName.trim();

    if (!isValidEventTitle(normalizedTitle)) {
      setError("Le titre doit contenir entre 3 et 80 caractères.");
      return;
    }

    if (!isValidEventDescription(normalizedDescription)) {
      setError("La description doit contenir entre 3 et 500 caractères.");
      return;
    }

    if (!date || !isValidEventDate(date)) {
      setError("Veuillez sélectionner une date valide.");
      return;
    }

    if (!isValidEventLocation(normalizedLocation)) {
      setError("Le lieu doit contenir entre 2 et 120 caractères.");
      return;
    }

    const keepsExistingDateTime =
      initialValues?.date === date && initialValues?.time === time;

    if (isEventPast(date, time) && !keepsExistingDateTime) {
      setError("Un événement ne peut pas être créé ou déplacé dans le passé.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        title: normalizedTitle,
        description: normalizedDescription,
        date,
        time,
        locationName: normalizedLocation,
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
        current={date || today}
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

      <Text style={styles.label}>Heure</Text>

      <View style={styles.timeSelector}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={hour}
            onValueChange={(value) => {
              setHour(value);
              setError(null);
            }}>
            {HOURS.map((value) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.timeSeparator}>:</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={minute}
            onValueChange={(value) => {
              setMinute(value);
              setError(null);
            }}>
            {MINUTES.map((value) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.selectedTime}>Heure sélectionnée : {time}</Text>

      <Text style={styles.label}>Ville ou code postal</Text>

      <TextInput
        style={styles.input}
        value={locationName}
        onChangeText={(value) => {
          setLocationName(value);
          setError(null);
        }}
        placeholder="Ex. Cambrai ou 59400"
        maxLength={EVENT_LOCATION_MAX_LENGTH}
        autoCapitalize="words"
      />

      <Text style={styles.locationHelper}>Facultatif</Text>

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
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: "600",
  },
  selectedTime: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  locationHelper: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: "right",
  },
  error: {
    marginBottom: 16,
    textAlign: "center",
  },
});
