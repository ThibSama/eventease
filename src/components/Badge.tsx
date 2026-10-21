// ============================================================================
// IMPORTS
// ============================================================================

import { StyleSheet, Text, View } from "react-native";

import { colors, radius } from "../theme";

// ============================================================================
// TYPES
// ============================================================================

type BadgeTone = "upcoming" | "past" | "accent" | "joined";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

// ============================================================================
// COMPOSANT
// ============================================================================

export function Badge({ label, tone = "upcoming" }: BadgeProps) {
  return (
    <View style={[styles.badge, tone === "joined" && styles.joinedBadge]}>
      <Text style={[styles.label, styles[tone]]}>{label}</Text>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    minWidth: 72,
    height: 24,
    borderRadius: radius.badge,
    paddingHorizontal: 9,
    justifyContent: "center",
    backgroundColor: colors.surfaceRaised,
  },
  joinedBadge: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
  },
  upcoming: {
    color: colors.success,
  },
  past: {
    color: colors.textMuted,
  },
  accent: {
    color: colors.primary,
  },
  joined: {
    color: colors.primary,
  },
});
