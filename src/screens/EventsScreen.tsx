import { StyleSheet, Text, View } from "react-native";

export function EventsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes événements</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
});
