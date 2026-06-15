import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { useApp } from '@/hooks/useApps';
import { getAppType } from '@/lib/appCatalog';

type Props = { id: string };

// Host genérico do mini-app em tela cheia: acha a instância pelo id, mostra
// nome + tipo no topo e um corpo placeholder. O interior dos tipos é fase 2.
export function MiniAppHost({ id }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const app = useApp(id);

  if (!app) {
    return (
      <View
        style={[
          styles.container,
          styles.centro,
          { backgroundColor: theme.background, paddingTop: insets.top },
        ]}>
        <Text style={[styles.nome, { color: theme.text }]}>Mini-app não encontrado</Text>
        <Text style={[styles.placeholder, { color: theme.textSecondary }]}>id: {id}</Text>
      </View>
    );
  }

  const tipo = getAppType(app.tipo);

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={[styles.faixa, { backgroundColor: tipo.cor }]} />
      <View style={styles.cabecalho}>
        <Text style={styles.icone}>{app.icone}</Text>
        <View style={styles.cabecalhoTexto}>
          <Text style={[styles.nome, { color: theme.text }]} numberOfLines={1}>
            {app.nome}
          </Text>
          <Text style={[styles.etiqueta, { color: tipo.cor }]}>{tipo.nome.toUpperCase()}</Text>
        </View>
      </View>

      <View style={[styles.corpo, styles.centro]}>
        <Text style={[styles.placeholder, { color: theme.textSecondary }]}>conteúdo em breve</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centro: { alignItems: 'center', justifyContent: 'center' },
  faixa: { height: 6, width: '100%' },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  cabecalhoTexto: { flex: 1 },
  icone: { fontSize: 34 },
  nome: { fontSize: 22, fontWeight: '700' },
  etiqueta: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 2 },
  corpo: { flex: 1 },
  placeholder: { fontSize: 15 },
});
