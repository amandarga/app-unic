import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppCard } from '@/components/AppCard';
import { useTheme } from '@/hooks/use-theme';
import type { AppInstance, AppTypeDef } from '@/lib/types';

const EMOJIS = ['📝', '✅', '📚', '🛒', '⭐', '🎯', '💡', '📌', '🎨', '🏆', '❤️', '🔖'];

type Props = {
  tipo: AppTypeDef;
  nomeInicial?: string;
  iconeInicial?: string;
  submitLabel: string;
  onSubmit: (dados: { nome: string; icone: string }) => void;
};

// Etapa 2 (spec §6.3). Reutilizável: na v0.3 vira também o formulário de editar.
export function DetalhesForm({ tipo, nomeInicial, iconeInicial, submitLabel, onSubmit }: Props) {
  const theme = useTheme();
  const [nome, setNome] = useState(nomeInicial ?? tipo.nome);
  const [icone, setIcone] = useState(iconeInicial ?? tipo.iconePadrao);

  // Prévia ao vivo: o card como vai ficar na Home (não tocável).
  const previa: AppInstance = {
    id: 'previa',
    tipo: tipo.id,
    nome: nome.trim() || tipo.nome,
    icone,
    ordem: 0,
    criadoEm: 0,
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled">
      <View style={styles.previaWrap}>
        <AppCard app={previa} width={120} disabled />
      </View>

      <Text style={[styles.rotulo, { color: theme.textSecondary }]}>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder={tipo.nome}
        placeholderTextColor={theme.textSecondary}
        style={[styles.input, { backgroundColor: theme.backgroundElement, color: theme.text }]}
        returnKeyType="done"
      />

      <Text style={[styles.rotulo, { color: theme.textSecondary }]}>Ícone</Text>
      <View style={styles.emojis}>
        {EMOJIS.map((e) => {
          const sel = e === icone;
          return (
            <Pressable
              key={e}
              onPress={() => setIcone(e)}
              accessibilityRole="button"
              accessibilityState={{ selected: sel }}
              style={[
                styles.emojiBtn,
                {
                  backgroundColor: theme.backgroundElement,
                  borderColor: sel ? tipo.cor : 'transparent',
                },
              ]}>
              <Text style={styles.emojiTxt}>{e}</Text>
            </Pressable>
          );
        })}
        <View style={[styles.emojiBtn, styles.fotoBtn, { borderColor: theme.backgroundSelected }]}>
          <Text style={[styles.fotoTxt, { color: theme.textSecondary }]}>Foto</Text>
          <Text style={[styles.fotoEmBreve, { color: theme.textSecondary }]}>em breve</Text>
        </View>
      </View>

      <Text style={[styles.rotulo, { color: theme.textSecondary }]}>Cor</Text>
      <View style={[styles.corLinha, { backgroundColor: theme.backgroundElement }]}>
        <View style={[styles.corSwatch, { backgroundColor: tipo.cor }]} />
        <Text style={[styles.corTexto, { color: theme.text }]}>Cor do tipo {tipo.nome}</Text>
        <Text style={styles.corLock}>🔒</Text>
      </View>

      <Pressable
        onPress={() => onSubmit({ nome, icone })}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.botao,
          { backgroundColor: tipo.cor, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Text style={styles.botaoTxt}>{submitLabel}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexShrink: 1 },
  conteudo: { padding: 16, gap: 8, paddingBottom: 40 },
  previaWrap: { alignItems: 'center', paddingVertical: 8 },
  rotulo: { fontSize: 13, fontWeight: '700', marginTop: 8 },
  input: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  emojis: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiTxt: { fontSize: 24 },
  fotoBtn: {
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
  },
  fotoTxt: { fontSize: 11, fontWeight: '600' },
  fotoEmBreve: { fontSize: 8 },
  corLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  corSwatch: { width: 18, height: 18, borderRadius: 4 },
  corTexto: { flex: 1, fontSize: 15 },
  corLock: { fontSize: 14 },
  botao: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  botaoTxt: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
