// ============================================================================
// IMPORTS
// ============================================================================

import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../theme";

// ============================================================================
// TYPES
// ============================================================================

type BackHeaderProps = {
  title: string;
  onBack: () => void;
};

// ============================================================================
// COMPOSANT
// ============================================================================

export function BackHeader({ title, onBack }: BackHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        hitSlop={12}
        onPress={onBack}
        style={styles.backButton}>
        <Text style={styles.backIcon}>←</Text>
      </Pressable>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingTop: 12,
    paddingBottom: 20,
  },
  backButton: {
    paddingVertical: 2,
  },
  backIcon: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
  },
});
