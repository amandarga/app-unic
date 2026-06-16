import { Stack } from 'expo-router';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { GlobalBar } from '@/components/GlobalBar';
import { Colors } from '@/constants/theme';

// Grupo principal: Home + mini-apps, com a barra global persistente por baixo.
// O modal "novo" fica ACIMA deste grupo (transparentModal no layout raiz), por
// isso consegue cobrir/embaçar a barra.
export default function MainLayout() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="app/[id]" />
        </Stack>
      </View>
      <GlobalBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});
