import { NavigationContainer } from "@react-navigation/native";

import { AppNavigator } from "./navigation/AppNavigator";

export function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
