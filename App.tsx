import React from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Dashboard from './src/components/Dashboard';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={isDarkMode ? ['#1a1a2e', '#0f0f1e'] : ['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <Dashboard />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});
