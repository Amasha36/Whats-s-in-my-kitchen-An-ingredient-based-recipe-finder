import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { KitchenProvider, useKitchen } from './src/state/KitchenContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { CustomButton } from './src/components/UI';
function Content() {
  const {
    ready,
    error,
    retry
  } = useKitchen();
  const [elapsed, setElapsed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setElapsed(true), 1400);
    return () => clearTimeout(timer);
  }, []);
  if (!ready || !elapsed) return <SplashScreen />;
  return <View style={{
    flex: 1
  }}>{!!error && <SafeAreaView edges={['top']} style={{
      padding: 12,
      backgroundColor: '#FFE4DE'
    }}><Text accessibilityRole="alert">{error}</Text><CustomButton title="Retry storage" onPress={retry} /></SafeAreaView>}<AppNavigator /></View>;
}
export default function App() {
  return <SafeAreaProvider><KitchenProvider><StatusBar barStyle="dark-content" /><Content /></KitchenProvider></SafeAreaProvider>;
}
