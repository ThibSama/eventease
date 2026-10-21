// ============================================================================
// IMPORTS
// ============================================================================

import type { NavigatorScreenParams } from "@react-navigation/native";

// ============================================================================
// AUTHENTIFICATION
// ============================================================================

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

// ============================================================================
// ÉVÉNEMENTS
// ============================================================================

export type EventLocation = {
  name: string;
  latitude?: number;
  longitude?: number;
};

export type EventOrganizer = {
  userId: string;
  username: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  participated: boolean;
  location?: EventLocation;
  organizer: EventOrganizer;
};

export type NewEvent = Omit<Event, "organizer">;

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

export type AppTabParamList = {
  Home: undefined;
  Events: undefined;
  Calendar: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  AppTabs: NavigatorScreenParams<AppTabParamList> | undefined;
  EventDetails: {
    eventId: string;
  };
  EventForm:
    | {
        eventId?: string;
      }
    | undefined;
};
