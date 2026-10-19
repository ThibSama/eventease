import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthScreen } from "../screens/AuthScreen";
import { EventsScreen } from "../screens/EventsScreen";
import type { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Events"
        component={EventsScreen}
        options={{ title: "EventEase" }}
      />
    </Stack.Navigator>
  );
}
