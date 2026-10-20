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

export type EventLocation = {
  name: string;
  latitude?: number;
  longitude?: number;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  participated: boolean;
  location?: EventLocation;
};

export type EventFormValues = {
  title: string;
  description: string;
  date: string;
  time: string;
  locationName: string;
};

// ============================================================================
// NAVIGATION
// ============================================================================

export type RootStackParamList = {
  Auth: undefined;
  Events: undefined;
  Calendar: undefined;
  EventForm:
    | {
        eventId?: string;
      }
    | undefined;
};
