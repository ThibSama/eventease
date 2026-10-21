// ============================================================================
// IMPORTS
// ============================================================================

import { Picker } from "@react-native-picker/picker";
import { Image } from "expo-image";
import { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { Calendar, type DateData } from "react-native-calendars";

import { calendarTheme, colors } from "../theme";
import type { EventFormValues } from "../types";
import {
  EVENT_CAPACITY_MAX,
  EVENT_DESCRIPTION_MAX_LENGTH,
  EVENT_LOCATION_MAX_LENGTH,
  EVENT_TITLE_MAX_LENGTH,
  formatEventDate,
  getTodayDate,
  isEventPast,
  isValidEventCapacity,
  isValidEventDate,
  isValidEventDescription,
  isValidEventLocation,
  isValidEventTitle,
} from "../utils/validation";
import { AppButton } from "./AppButton";

// ============================================================================
// TYPES
// ============================================================================

type EventFormProps = {
  initialValues?: EventFormValues;
  currentParticipantCount?: number;
  submitLabel?: string;
  onSubmit: (values: EventFormValues) => Promise<void>;
};

// ============================================================================
// CONSTANTES
// ============================================================================

const HOURS = Array.from({ length: 24 }, (_, index) =>
  String(index).padStart(2, "0"),
);

const MINUTES = Array.from({ length: 60 }, (_, index) =>
  String(index).padStart(2, "0"),
);

// Le sélecteur de date du formulaire est plus compact que l'écran Calendrier.
const FORM_CALENDAR_THEME = {
  ...calendarTheme,
  textDayFontSize: 11,
  textMonthFontSize: 15,
  textDayHeaderFontSize: 11,
  textDayHeaderFontWeight: "400",
} as const;

// Seul Android affiche une liste déroulante fermée : iOS et le web gardent leur rendu natif.
const SHOW_PICKER_CHEVRON = Platform.OS === "android";

// ============================================================================
// UTILITAIRES
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
// COMPOSANT
// ============================================================================

export function EventForm({
  initialValues,
  currentParticipantCount = 0,
  submitLabel = "Enregistrer",
  onSubmit,
}: EventFormProps) {
  // --- État du formulaire ----------------------------------------------------

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

  const [capacity, setCapacity] = useState(
    initialValues?.maxParticipants?.toString() ?? "",
  );

  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const today = getTodayDate();

  const time = `${hour}:${minute}`;

  // --- Sélection de date -----------------------------------------------------

  function handleDateSelect(day: DateData) {
    setDate(day.dateString);
    setError(null);
  }

  // --- Validation et enregistrement -----------------------------------------

  async function handleSubmit() {
    const normalizedTitle = title.trim();

    const normalizedDescription = description.trim();

    const normalizedLocation = locationName.trim();

    const normalizedCapacity = capacity.trim();

    let maxParticipants: number | undefined;

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

    if (normalizedCapacity) {
      maxParticipants = Number(normalizedCapacity);

      if (!isValidEventCapacity(maxParticipants)) {
        setError(
          `Le nombre de places doit être compris entre 1 et ${EVENT_CAPACITY_MAX}.`,
        );
        return;
      }

      if (maxParticipants < currentParticipantCount) {
        setError(
          `La capacité ne peut pas être inférieure aux ${currentParticipantCount} participation${currentParticipantCount > 1 ? "s" : ""} déjà enregistrée${currentParticipantCount > 1 ? "s" : ""}.`,
        );
        return;
      }
    }

    // En édition, une date devenue passée peut être conservée telle quelle.
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
        maxParticipants,
      });
    } finally {
      setSubmitting(false);
    }
  }

  // --- Rendu -----------------------------------------------------------------

  return (
    <View>
      <Text style={styles.label}>Titre</Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Ex. Atelier Docker"
        placeholderTextColor={colors.textMuted}
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
        placeholder="Décrivez votre événement…"
        placeholderTextColor={colors.textMuted}
        maxLength={EVENT_DESCRIPTION_MAX_LENGTH}
        multiline
      />

      <Text style={styles.helper}>
        {description.length}/{EVENT_DESCRIPTION_MAX_LENGTH}
      </Text>

      <Text style={styles.label}>Date</Text>

      <Calendar
        style={styles.calendar}
        theme={FORM_CALENDAR_THEME}
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

      <Text style={[styles.label, styles.timeLabel]}>Heure</Text>

      <View style={styles.timeSelector}>
        <View style={[styles.pickerContainer, styles.hourPicker]}>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            dropdownIconColor={
              SHOW_PICKER_CHEVRON ? "transparent" : colors.text
            }
            mode="dropdown"
            accessibilityLabel="Heures"
            selectedValue={hour}
            onValueChange={(value) => {
              setHour(value);
              setError(null);
            }}>
            {HOURS.map((value) => (
              <Picker.Item
                key={value}
                label={value}
                value={value}
                color={Platform.OS === "ios" ? colors.text : undefined}
              />
            ))}
          </Picker>

          {SHOW_PICKER_CHEVRON ? (
            <View style={styles.pickerChevron}>
              <Image
                source={require("../assets/images/design/icon-chevron-down.svg")}
                style={styles.pickerChevronIcon}
                contentFit="contain"
              />
            </View>
          ) : null}
        </View>

        <View style={[styles.pickerContainer, styles.minutePicker]}>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            dropdownIconColor={
              SHOW_PICKER_CHEVRON ? "transparent" : colors.text
            }
            mode="dropdown"
            accessibilityLabel="Minutes"
            selectedValue={minute}
            onValueChange={(value) => {
              setMinute(value);
              setError(null);
            }}>
            {MINUTES.map((value) => (
              <Picker.Item
                key={value}
                label={value}
                value={value}
                color={Platform.OS === "ios" ? colors.text : undefined}
              />
            ))}
          </Picker>

          {SHOW_PICKER_CHEVRON ? (
            <View style={styles.pickerChevron}>
              <Image
                source={require("../assets/images/design/icon-chevron-down.svg")}
                style={styles.pickerChevronIcon}
                contentFit="contain"
              />
            </View>
          ) : null}
        </View>
      </View>

      <Text style={[styles.label, styles.locationLabel]}>
        Ville ou code postal
      </Text>

      <TextInput
        style={[styles.input, styles.locationInput]}
        value={locationName}
        onChangeText={(value) => {
          setLocationName(value);
          setError(null);
        }}
        placeholder="Cambrai ou 59400"
        placeholderTextColor={colors.textMuted}
        maxLength={EVENT_LOCATION_MAX_LENGTH}
        autoCapitalize="words"
      />

      <Text style={styles.helper}>Facultatif</Text>

      <Text style={styles.label}>Nombre de places</Text>

      <TextInput
        style={styles.input}
        value={capacity}
        onChangeText={(value) => {
          setCapacity(value.replace(/\D/g, ""));
          setError(null);
        }}
        placeholder="Ex. 20"
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        maxLength={4}
      />

      <Text style={styles.helper}>
        {currentParticipantCount > 0
          ? `${currentParticipantCount} participation${currentParticipantCount > 1 ? "s" : ""} actuellement · `
          : ""}
        Laisser vide pour un événement sans limite.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.submit}>
        <AppButton
          label={submitLabel}
          onPress={handleSubmit}
          disabled={submitting}
        />
      </View>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    color: colors.text,
    fontSize: 13,
  },
  description: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  helper: {
    marginTop: 3,
    marginBottom: 14,
    color: colors.textSubtle,
    fontSize: 10,
    textAlign: "right",
  },
  calendar: {
    paddingBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: "hidden",
  },
  selectedDate: {
    marginTop: 8,
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
  timeLabel: {
    marginTop: 20,
  },
  timeSelector: {
    flexDirection: "row",
    gap: 19,
  },
  pickerContainer: {
    minHeight: 45,
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    overflow: "hidden",
  },
  hourPicker: {
    flex: 153,
  },
  minutePicker: {
    flex: 174,
  },
  picker: {
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 0,
    fontSize: 15,
    paddingHorizontal: 12,
  },
  pickerItem: {
    height: 120,
    color: colors.text,
    fontSize: 15,
  },
  pickerChevron: {
    position: "absolute",
    right: 13,
    pointerEvents: "none",
  },
  pickerChevronIcon: {
    width: 19,
    height: 19,
  },
  locationLabel: {
    marginTop: 20,
  },
  locationInput: {
    minHeight: 43,
    paddingVertical: 11,
    fontSize: 12,
  },
  error: {
    marginBottom: 14,
    color: colors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  submit: {
    marginTop: 8,
  },
});
