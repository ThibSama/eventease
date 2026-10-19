import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';

export function App() {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <Text style={styles.title}>EventEase</Text>
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});
