import { NavigationContainer } from "@react-navigation/native";

import { AppProvider } from "./context/AppContext";
import { AppNavigator } from "./navigation/AppNavigator";

export function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
