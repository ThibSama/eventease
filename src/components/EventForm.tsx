// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

// ============================================================================
// TYPES
// ============================================================================

type EventFormValues = {
  title: string;
  description: string;
  date: string;
};

type EventFormProps = {
  onSubmit: (values: EventFormValues) => Promise<void>;
};

// ============================================================================
// COMPONENT
// ============================================================================

export function EventForm({ onSubmit }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedDate = date.trim();

    if (!normalizedTitle || !normalizedDescription || !normalizedDate) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        title: normalizedTitle,
        description: normalizedDescription,
        date: normalizedDate,
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
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.description]}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        multiline
      />

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="JJ/MM/AAAA"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title="Enregistrer"
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
    marginBottom: 16,
  },
  description: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  error: {
    marginBottom: 16,
    textAlign: "center",
  },
});
