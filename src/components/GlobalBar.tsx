import { usePathname, useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

type Item = {
  key: string;
  label: string;
  icone?: string;
  iconeNode?: ReactNode;
  onPress?: () => void;
  ativo?: boolean;
  inerte?: boolean;
};

// Barra global persistente (spec 4): [ Início · Buscar · Slot · Perfil ].
// Aparece igual na Home e dentro de cada mini-app. Na v0.1 só Início funciona;
// os demais ficam visuais/inertes. O "slot" mostra um quadradinho tracejado
// (placeholder vazio, fig-1) — não confundir com "adicionar".
export function GlobalBar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const itens: Item[] = [
    { key: 'inicio', label: 'Início', icone: '🏠', onPress: () => router.replace('/'), ativo: pathname === '/' },
    { key: 'buscar', label: 'Buscar', icone: '🔍', inerte: true },
    {
      key: 'slot',
      label: 'Slot',
      inerte: true,
      iconeNode: <View style={[styles.slotVazio, { borderColor: theme.textSecondary }]} />,
    },
    { key: 'perfil', label: 'Perfil', icone: '👤', inerte: true },
  ];

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.backgroundElement,
          paddingBottom: insets.bottom,
        },
      ]}>
      {itens.map((item) => (
        <Pressable
          key={item.key}
          onPress={item.onPress}
          disabled={item.inerte}
          accessibilityRole="button"
          accessibilityState={{ selected: item.ativo, disabled: item.inerte }}
          accessibilityLabel={item.label}
          style={styles.item}>
          {item.iconeNode ? (
            <View style={[styles.iconeWrap, item.inerte && styles.inerte]}>{item.iconeNode}</View>
          ) : (
            <Text style={[styles.icone, item.inerte && styles.inerte]}>{item.icone}</Text>
          )}
          <Text
            style={[
              styles.label,
              { color: item.ativo ? theme.text : theme.textSecondary },
              item.inerte && styles.inerte,
            ]}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    gap: 2,
  },
  icone: {
    fontSize: 20,
  },
  iconeWrap: {
    height: 20,
    justifyContent: 'center',
  },
  slotVazio: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
  inerte: {
    opacity: 0.4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
