import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { getAppType } from '@/lib/appCatalog';
import type { AppInstance } from '@/lib/types';

type Props = {
  app: AppInstance;
  width: number;
  onPress?: () => void;
  disabled?: boolean; // prévia não-tocável (etapa 2 do "+ Novo")
};

// Card de mini-app (spec 3.2): faixa de cor + etiqueta do tipo + emoji + nome.
// A etiqueta aparece SEMPRE (regra "cor nunca sozinha"). Reutilizável.
export function AppCard({ app, width, onPress, disabled }: Props) {
  const theme = useTheme();
  const tipo = getAppType(app.tipo);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole={disabled ? undefined : 'button'}
      accessibilityLabel={`${app.nome}, tipo ${tipo.nome}`}
      style={({ pressed }) => [
        styles.card,
        { width, backgroundColor: theme.backgroundElement, opacity: pressed && !disabled ? 0.7 : 1 },
      ]}>
      <View style={[styles.faixa, { backgroundColor: tipo.cor }]}>
        <Text style={styles.etiqueta} numberOfLines={1}>
          {tipo.nome.toUpperCase()}
        </Text>
      </View>

      <View style={styles.corpo}>
        <Text style={styles.icone}>{app.icone}</Text>
        <Text style={[styles.nome, { color: theme.text }]} numberOfLines={2}>
          {app.nome}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 120,
  },
  faixa: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  etiqueta: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  corpo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 6,
  },
  icone: {
    fontSize: 34,
  },
  nome: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
