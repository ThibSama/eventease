// ============================================================================
// IMPORTS
// ============================================================================

import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppButton } from "../components/AppButton";
import { useApp } from "../hooks/useApp";
import { type UserLocationStatus, useLocation } from "../hooks/useLocation";
import { colors, radius, spacing } from "../theme";

// ============================================================================
// CONSTANTS
// ============================================================================

const LOCATION_STATUS_LABELS: Record<
  UserLocationStatus,
  {
    title: string;
    description: string;
  }
> = {
  loading: {
    title: "Recherche en cours…",
    description: "Votre position est demandée pour calculer les distances.",
  },
  granted: {
    title: "Localisation active",
    description:
      "Les distances aux événements sont calculées depuis votre position.",
  },
  denied: {
    title: "Localisation refusée",
    description:
      "Autorisez la localisation dans les réglages pour afficher les distances.",
  },
  unavailable: {
    title: "Localisation indisponible",
    description: "Votre position n'a pas pu être déterminée.",
  },
};

// ============================================================================
// COMPOSANT
// ============================================================================

export function ProfileScreen() {
  const { user, events, logout } = useApp();

  // --- Localisation utilisateur ---------------------------------------------

  const { status: locationStatus } = useLocation();

  const locationLabel = LOCATION_STATUS_LABELS[locationStatus];

  // --- Statistiques ----------------------------------------------------------

  const joinedCount = events.filter((event) => event.participated).length;

  // --- Rendu -----------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profil</Text>

        <View style={styles.identity}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.email.charAt(0).toUpperCase() ?? "?"}
            </Text>
          </View>

          <View style={styles.identityText}>
            <Text style={styles.label}>CONNECTÉ AVEC</Text>

            <Text style={styles.email} numberOfLines={1}>
              {user?.email}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>ACTIVITÉ</Text>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>
            {events.length} événement{events.length > 1 ? "s" : ""}
          </Text>

          <Text style={styles.panelText}>
            {joinedCount} participation{joinedCount > 1 ? "s" : ""}
          </Text>
        </View>

        <Text style={styles.sectionLabel}>LOCALISATION</Text>

        <View style={styles.panel}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                locationStatus === "granted" && styles.statusDotActive,
              ]}
            />

            <Text style={styles.panelTitle}>{locationLabel.title}</Text>
          </View>

          <Text style={styles.panelText}>{locationLabel.description}</Text>
        </View>

        <View style={styles.logout}>
          <AppButton
            label="Se déconnecter"
            variant="secondary"
            onPress={logout}
          />
        </View>
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
    flexGrow: 1,
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    paddingHorizontal: spacing.screen,
    paddingTop: 22,
    paddingBottom: 32,
  },
  title: {
    marginLeft: 2,
    color: colors.text,
    fontSize: 28,
    fontWeight: "700",
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.panel,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.avatar,
  },
  avatarText: {
    color: colors.avatarText,
    fontSize: 20,
    fontWeight: "700",
  },
  identityText: {
    flex: 1,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
  },
  email: {
    marginTop: 4,
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  sectionLabel: {
    marginTop: 28,
    marginBottom: 12,
    marginLeft: 2,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "700",
  },
  panel: {
    gap: 6,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  panelText: {
    color: colors.textMuted,
    fontSize: 13,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSubtle,
  },
  statusDotActive: {
    backgroundColor: colors.success,
  },
  logout: {
    marginTop: "auto",
    paddingTop: 32,
  },
});
