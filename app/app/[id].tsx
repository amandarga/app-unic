import { useLocalSearchParams } from 'expo-router';

import { MiniAppHost } from '@/components/MiniAppHost';

// Rota fina e dinâmica: abre um mini-app pelo id e delega ao host.
export default function MiniAppRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <MiniAppHost id={id} />;
}
