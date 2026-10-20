// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  isValidEmail,
  isValidPassword,
} from "../utils/validation";
import { useApp } from "../hooks/useApp";

// ============================================================================
// COMPOSANT
// ============================================================================

export function AuthScreen() {
  const { login, register } = useApp();

  // --- État du formulaire ----------------------------------------------------

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // --- Soumission ------------------------------------------------------------

  async function handleSubmit() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        `Le mot de passe doit contenir entre ${PASSWORD_MIN_LENGTH} et ${PASSWORD_MAX_LENGTH} caractères.`,
      );
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      if (isRegistering) {
        await register(normalizedEmail, password);
        return;
      }

      const success = await login(normalizedEmail, password);

      if (!success) {
        setError("Email ou mot de passe incorrect.");
      }
    } finally {
      setSubmitting(false);
    }
  }
  // --- Changement de mode ----------------------------------------------------

  function handleToggleMode() {
    setIsRegistering((current) => !current);
    setError(null);
  }

  // --- Rendu -----------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EventEase</Text>

      <Text style={styles.subtitle}>
        {isRegistering ? "Inscription" : "Connexion"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        maxLength={EMAIL_MAX_LENGTH}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        maxLength={PASSWORD_MAX_LENGTH}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.primaryButton}>
        <Button
          title={isRegistering ? "Créer le compte" : "Se connecter"}
          onPress={handleSubmit}
          disabled={submitting}
        />
      </View>

      <Button
        title={isRegistering ? "J'ai déjà un compte" : "Créer un compte"}
        onPress={handleToggleMode}
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
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  error: {
    marginBottom: 12,
    textAlign: "center",
  },
  primaryButton: {
    marginBottom: 8,
  },
});
