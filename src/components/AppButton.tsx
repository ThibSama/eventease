// ============================================================================
// IMPORTS
// ============================================================================

import { Pressable, StyleSheet, Text } from "react-native";

import { colors, radius } from "../theme";

// ============================================================================
// TYPES
// ============================================================================

type AppButtonVariant = "primary" | "secondary" | "danger" | "inactive";

type AppButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: AppButtonVariant;
  disabled?: boolean;
};

// ============================================================================
// COMPOSANT
// ============================================================================

export function AppButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: AppButtonProps) {
  // Le variant « inactive » reproduit l'état désactivé des maquettes.
  const isInactive = variant === "inactive";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isInactive }}
      disabled={disabled || isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text
        style={[
          styles.label,
          variant === "primary" && styles.primaryLabel,
          variant === "danger" && styles.dangerLabel,
          isInactive && styles.inactiveLabel,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.button,
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  inactive: {
    minHeight: 49,
    borderRadius: 12,
    backgroundColor: colors.disabled,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  primaryLabel: {
    color: colors.primaryText,
  },
  dangerLabel: {
    color: colors.danger,
  },
  inactiveLabel: {
    color: colors.textMuted,
  },
});
