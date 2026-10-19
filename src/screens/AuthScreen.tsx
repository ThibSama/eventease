import { StyleSheet, Text, View } from "react-native";

export function AuthScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EventEase</Text>
      <Text>Connexion</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 16,
  },
});
