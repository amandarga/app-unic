import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppCard } from '@/components/AppCard';
import { NewCard } from '@/components/NewCard';
import { useApps } from '@/hooks/useApps';
import { useTheme } from '@/hooks/use-theme';

const GAP = 12;
const PADDING = 16;

// Home (launcher): barra superior inerte (v0.1) + grade de cards + card "Novo".
export function LauncherScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { apps } = useApps();

  const colunas = width >= 600 ? 5 : 3; // responsivo (mais colunas no tablet)
  const cardWidth = Math.floor((width - PADDING * 2 - GAP * (colunas - 1)) / colunas);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      {/* Barra superior — visual inerte na v0.1 (fidelidade à fig-1) */}
      <View style={styles.topo}>
        <View style={[styles.busca, { backgroundColor: theme.backgroundElement }]}>
          <Text style={styles.buscaIcone}>🔍</Text>
          <TextInput
            editable={false}
            placeholder="Pesquisar"
            placeholderTextColor={theme.textSecondary}
            style={[styles.buscaInput, { color: theme.text }]}
          />
        </View>
        <Text style={[styles.editar, { color: theme.textSecondary }]}>Editar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.grade}>
        {apps.map((app) => (
          <AppCard
            key={app.id}
            app={app}
            width={cardWidth}
            onPress={() => router.push({ pathname: '/app/[id]', params: { id: app.id } })}
          />
        ))}
        <NewCard width={cardWidth} onPress={() => router.push('/novo')} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: PADDING,
    paddingVertical: 10,
  },
  busca: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 12,
  },
  buscaIcone: { fontSize: 14, opacity: 0.5 },
  buscaInput: { flex: 1, fontSize: 15, padding: 0 },
  editar: { fontSize: 15, fontWeight: '600' },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    padding: PADDING,
  },
});
