import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Stack raiz. Envolve o grupo (main) (Home + mini-apps + barra global) e a rota
// "novo", que é apresentada como transparentModal POR CIMA do (main) — assim ela
// cobre/embaça a barra global.
export default function RootLayout() {
  const scheme = useColorScheme() ?? 'light';

  return (
    <SafeAreaProvider>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(main)" />
          <Stack.Screen
            name="novo"
            options={{ presentation: 'transparentModal', animation: 'fade' }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
