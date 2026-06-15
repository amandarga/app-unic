import { Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type Props = {
  width: number;
  onPress?: () => void;
};

// Card "Novo" (spec 3.3): sempre no fim da grade. Abre o fluxo "+ Novo".
export function NewCard({ width, onPress }: Props) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Novo mini-app"
      style={({ pressed }) => [
        styles.card,
        { width, borderColor: theme.backgroundSelected, opacity: pressed ? 0.6 : 1 },
      ]}>
      <Text style={[styles.mais, { color: theme.textSecondary }]}>＋</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>Novo</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    minHeight: 120,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  mais: {
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
});
