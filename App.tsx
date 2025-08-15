/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, SafeAreaView } from 'react-native';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer';
(global as any).Buffer = Buffer;
import process from 'process';
(global as any).process = process;
import { getClient, endClient } from './src/mqtt/client';
import { useEffect } from 'react';
import { HomeScreen } from './src/screens/HomeScreen';

function App() {
  useEffect(() => {
    getClient();
    return () => endClient();
  }, [])

  return (
    <GestureHandlerRootView style={styles.GestureContainer}>
      <SafeAreaView style={styles.SafeViewContainer}>
        <HomeScreen />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  GestureContainer: {
    flex: 1,
  },
  SafeViewContainer: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
});

export default App;
