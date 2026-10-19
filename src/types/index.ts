// ============================================================================
// AUTHENTICATION
// ============================================================================

export type User = {
  email: string;
  password: string;
};

// ============================================================================
// EVENTS
// ============================================================================

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  participated: boolean;
  location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

// ============================================================================
// NAVIGATION
// ============================================================================

export type RootStackParamList = {
  Auth: undefined;
  Events: undefined;
  EventForm: undefined;
};
