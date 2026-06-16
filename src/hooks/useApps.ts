import { useStorage } from '@/hooks/useStorage';
import { gerarId } from '@/lib/id';
import type { AppInstance, AppTypeId } from '@/lib/types';

// Semente usada no primeiro uso (storage vazio). A partir daí o registro vive no
// AsyncStorage, sob a chave 'apps:registro'.
const SEMENTE: AppInstance[] = [
  { id: 'mercado', tipo: 'checklist', nome: 'Mercado', icone: '🛒', ordem: 0, criadoEm: 0 },
  { id: 'estudos', tipo: 'notas', nome: 'Notas de estudos', icone: '📝', ordem: 1, criadoEm: 0 },
  { id: 'leituras', tipo: 'livros', nome: 'Minhas leituras', icone: '📚', ordem: 2, criadoEm: 0 },
  { id: 'copa', tipo: 'figurinhas', nome: 'Figurinhas da Copa', icone: '⚽', ordem: 3, criadoEm: 0 },
  { id: 'rotina', tipo: 'skincare', nome: 'Skincare', icone: '🧴', ordem: 4, criadoEm: 0 },
];

export type NovoAppInput = { tipo: AppTypeId; nome: string; icone: string };

export function useApps() {
  const [registro, setRegistro, carregando] = useStorage<AppInstance[]>('apps:registro', SEMENTE);
  const apps = [...registro].sort((a, b) => a.ordem - b.ordem);

  // Cria uma nova instância (id/ordem/criadoEm preenchidos) e persiste.
  const addApp = (input: NovoAppInput): AppInstance => {
    const nova: AppInstance = {
      id: gerarId(),
      tipo: input.tipo,
      nome: input.nome,
      icone: input.icone,
      ordem: registro.length,
      criadoEm: Date.now(),
    };
    setRegistro([...registro, nova]);
    return nova;
  };

  return { apps, addApp, carregando };
}

export function useApp(id: string): AppInstance | undefined {
  return useApps().apps.find((app) => app.id === id);
}
