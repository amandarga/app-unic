import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { APP_TYPE_LIST } from '@/lib/appCatalog';
import type { AppTypeDef } from '@/lib/types';

type Props = { onSelecionar: (tipo: AppTypeDef) => void };

// Etapa 1 (spec §6.2): lista só os tipos INSTANCIÁVEIS.
export function EtapaTipo({ onSelecionar }: Props) {
  const theme = useTheme();
  const tipos = APP_TYPE_LIST.filter((t) => t.instanciavel);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.lista}
      keyboardShouldPersistTaps="handled">
      <Text style={[styles.titulo, { color: theme.text }]}>Escolha o tipo</Text>
      {tipos.map((tipo) => (
        <Pressable
          key={tipo.id}
          onPress={() => onSelecionar(tipo)}
          accessibilityRole="button"
          accessibilityLabel={`${tipo.nome}. ${tipo.descricao}`}
          style={({ pressed }) => [
            styles.linha,
            { backgroundColor: theme.backgroundElement, opacity: pressed ? 0.7 : 1 },
          ]}>
          <View style={[styles.cor, { backgroundColor: tipo.cor }]} />
          <Text style={styles.emoji}>{tipo.iconePadrao}</Text>
          <View style={styles.textos}>
            <Text style={[styles.nome, { color: theme.text }]}>{tipo.nome}</Text>
            <Text style={[styles.descricao, { color: theme.textSecondary }]}>{tipo.descricao}</Text>
          </View>
          <Text style={[styles.chevron, { color: theme.textSecondary }]}>›</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexShrink: 1 },
  lista: { padding: 16, gap: 10 },
  titulo: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    minHeight: 64,
  },
  cor: { width: 16, height: 16, borderRadius: 4 },
  emoji: { fontSize: 24 },
  textos: { flex: 1 },
  nome: { fontSize: 16, fontWeight: '600' },
  descricao: { fontSize: 13, marginTop: 1 },
  chevron: { fontSize: 24, fontWeight: '400' },
});
