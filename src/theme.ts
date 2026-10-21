// ============================================================================
// COULEURS
// ============================================================================

export const colors = {
  background: "#071017",
  surface: "#101c26",
  surfaceRaised: "#162b3b",
  surfaceMuted: "#132839",
  border: "#294354",

  text: "#f1f7fc",
  textMuted: "#9eb2c4",
  textSubtle: "#7998ac",

  primary: "#0dafff",
  primaryText: "#001925",
  primarySoft: "#092838",

  success: "#00ccbe",
  warning: "#fad173",

  disabled: "#334350",
  danger: "#ff7a7a",
  dangerSoft: "#3a1d24",

  avatar: "#174c68",
  avatarText: "#4ac9ff",

  timeline: "#1b465c",
  progressTrack: "#123342",
} as const;

// ============================================================================
// DIMENSIONS
// ============================================================================

export const spacing = {
  screen: 20,
} as const;

export const radius = {
  badge: 12,
  input: 10,
  card: 14,
  button: 14,
  panel: 16,
  cover: 17,
} as const;

// ============================================================================
// THÈME DU CALENDRIER
// ============================================================================

// Thème partagé par les calendriers de l'écran Calendrier et du formulaire.
export const calendarTheme = {
  calendarBackground: colors.surface,
  backgroundColor: colors.surface,
  textSectionTitleColor: colors.textMuted,
  dayTextColor: colors.text,
  todayTextColor: colors.primary,
  selectedDayBackgroundColor: colors.primary,
  selectedDayTextColor: colors.primaryText,
  textDisabledColor: "#4a6273",
  monthTextColor: colors.text,
  arrowColor: colors.text,
  disabledArrowColor: "#4a6273",
  dotColor: colors.success,
  selectedDotColor: colors.success,
  textMonthFontWeight: "700",
  textDayHeaderFontWeight: "700",
  textDayFontSize: 13,
  textMonthFontSize: 18,
  textDayHeaderFontSize: 12,
} as const;
