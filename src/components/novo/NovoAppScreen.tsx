import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DetalhesForm } from '@/components/novo/DetalhesForm';
import { EtapaTipo } from '@/components/novo/EtapaTipo';
import { useTheme } from '@/hooks/use-theme';
import { useApps } from '@/hooks/useApps';
import type { AppTypeDef } from '@/lib/types';

// Orquestra o fluxo "+ Novo" em 2 etapas (spec §6): escolher o tipo → detalhes.
export function NovoAppScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { addApp } = useApps();
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [tipo, setTipo] = useState<AppTypeDef | null>(null);

  const fechar = () => router.back();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.cabecalho}>
        <Pressable
          onPress={etapa === 1 ? fechar : () => setEtapa(1)}
          accessibilityRole="button"
          style={styles.acao}>
          <Text style={[styles.acaoTxt, { color: theme.textSecondary }]}>
            {etapa === 1 ? 'Cancelar' : '‹ Voltar'}
          </Text>
        </Pressable>
        <Text style={[styles.passo, { color: theme.textSecondary }]}>Etapa {etapa} de 2</Text>
      </View>

      <View style={[styles.progressoTrilha, { backgroundColor: theme.backgroundElement }]}>
        <View
          style={[
            styles.progressoBarra,
            { width: etapa === 1 ? '50%' : '100%', backgroundColor: theme.text },
          ]}
        />
      </View>

      {etapa === 1 ? (
        <EtapaTipo
          onSelecionar={(t) => {
            setTipo(t);
            setEtapa(2);
          }}
        />
      ) : tipo ? (
        <DetalhesForm
          tipo={tipo}
          nomeInicial={tipo.nome}
          iconeInicial={tipo.iconePadrao}
          submitLabel="Criar app"
          onSubmit={({ nome, icone }) => {
            addApp({ tipo: tipo.id, nome: nome.trim() || tipo.nome, icone });
            fechar();
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // flexShrink (não flex:1) pra abraçar o conteúdo e encolher só ao bater o
  // maxHeight do card. flex:1 colapsaria a altura no Yoga nativo (pai auto).
  container: { flexShrink: 1 },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 8,
    minHeight: 48,
  },
  acao: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  acaoTxt: { fontSize: 16, fontWeight: '600' },
  passo: { fontSize: 13, fontWeight: '600', paddingHorizontal: 8 },
  progressoTrilha: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 16,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressoBarra: { height: 4, borderRadius: 2 },
});

