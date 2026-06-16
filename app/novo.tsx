import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';

import { NovoAppScreen } from '@/components/novo/NovoAppScreen';
import { useTheme } from '@/hooks/use-theme';

// Moldura do "+ Novo" (decisão: modal CENTRALIZADO, não folha de baixo):
// fundo embaçado (Home + barra atrás) + card no meio da tela. Tocar fora fecha.
export default function NovoRoute() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const theme = useTheme();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.fill}>
      <View style={styles.centro}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Fechar">
          <BlurView
            intensity={40}
            tint={scheme === 'dark' ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
            experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
          />
        </Pressable>

        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <NovoAppScreen />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    borderRadius: 20,
    overflow: 'hidden',
  },
});
