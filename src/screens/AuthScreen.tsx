// ============================================================================
// IMPORTS
// ============================================================================

import { Image } from "expo-image";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../components/AppButton";
import { useApp } from "../hooks/useApp";
import { colors } from "../theme";
import {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  isValidEmail,
  isValidPassword,
} from "../utils/validation";

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <View style={styles.heroCanvas}>
              <Image
                source={require("../assets/images/design/auth-orbit.svg")}
                style={styles.illustration}
                contentFit="fill"
              />

              <View style={styles.brand}>
                <Text style={styles.brandTitle}>
                  Event <Text style={styles.brandAccent}>Ease</Text>
                </Text>

                <Text style={styles.tagline}>
                  DES ÉVÉNEMENTS PLUS PROCHES DE VOUS
                </Text>
              </View>

              <View style={styles.orbitLine} />
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionLabel}>
              {isRegistering ? "NOUVEAU COMPTE" : "VOTRE ESPACE"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Adresse e-mail"
              placeholderTextColor={colors.textMuted}
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
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={PASSWORD_MAX_LENGTH}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <AppButton
                label={isRegistering ? "Créer le compte  →" : "Se connecter  →"}
                onPress={handleSubmit}
                disabled={submitting}
              />

              <AppButton
                label={
                  isRegistering ? "J'ai déjà un compte" : "Créer un compte"
                }
                variant="secondary"
                onPress={handleToggleMode}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  hero: {
    height: 340,
    overflow: "hidden",
    alignItems: "center",
  },
  heroCanvas: {
    width: 390,
    height: 340,
  },
  illustration: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 390,
    height: 340,
  },
  brand: {
    position: "absolute",
    top: 185,
    left: 42,
    right: 20,
  },
  brandTitle: {
    color: colors.text,
    fontSize: 44,
    fontWeight: "700",
  },
  brandAccent: {
    color: colors.primary,
  },
  tagline: {
    marginTop: 4,
    marginLeft: 3,
    color: "#e8f6ff",
    fontSize: 11,
    fontWeight: "700",
  },
  orbitLine: {
    position: "absolute",
    top: 320,
    left: 82,
    width: 226,
    height: 1,
    backgroundColor: colors.primary,
  },
  form: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  sectionLabel: {
    marginBottom: 22,
    marginLeft: 4,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  input: {
    height: 55,
    marginBottom: 14,
    paddingHorizontal: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    fontSize: 14,
  },
  error: {
    marginBottom: 8,
    color: colors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  actions: {
    gap: 14,
    marginTop: 19,
    marginHorizontal: -3,
  },
});
