// ============================================================================
// IMPORTS
// ============================================================================

import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

import { useApp } from "../hooks/useApp";

// ============================================================================
// COMPONENT
// ============================================================================

export function AuthScreen() {
  const { login, register } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Veuillez remplir tous les champs.");
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

  function handleToggleMode() {
    setIsRegistering((current) => !current);
    setError(null);
  }

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
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
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
