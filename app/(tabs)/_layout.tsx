import { Tabs } from 'expo-router';
import { Text, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

// Ícone simples por emoji — sem dependência extra. Trocar por @expo/vector-icons
// (ou ícones próprios) quando/se a gente quiser algo mais elaborado.
function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 22 }}>{emoji}</Text>;
}

// Define as abas inferiores. Para adicionar uma aba nova: criar a rota fina em
// app/(tabs)/<nome>.tsx e registrar mais um <Tabs.Screen> aqui (título + ícone).
export default function TabsLayout() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { backgroundColor: colors.background },
      }}>
      <Tabs.Screen
        name="index"
        options={{ title: 'Skincare', tabBarIcon: () => <TabIcon emoji="🧴" /> }}
      />
      <Tabs.Screen
        name="figurinhas"
        options={{ title: 'Figurinhas', tabBarIcon: () => <TabIcon emoji="⚽" /> }}
      />
      <Tabs.Screen
        name="tarefas"
        options={{ title: 'Tarefas', tabBarIcon: () => <TabIcon emoji="✅" /> }}
      />
    </Tabs>
  );
}
