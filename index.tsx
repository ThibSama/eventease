// ============================================================================
// IMPORTS
// ============================================================================

import "@expo/metro-runtime";
import { registerRootComponent } from "expo";

import { App } from "./src/App";

// ============================================================================
// DÉMARRAGE
// ============================================================================

// registerRootComponent initialise correctement l'application sur Expo et le web.
registerRootComponent(App);
