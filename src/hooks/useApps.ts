import type { AppInstance } from '@/lib/types';

// Semente FIXA (v0.1): ainda SEM AsyncStorage. Este hook é a costura — na v0.2
// ele passa a ler/escrever no storage sem a Home precisar mudar.
const SEED: AppInstance[] = [
  { id: 'mercado', tipo: 'checklist', nome: 'Mercado', icone: '🛒', ordem: 0, criadoEm: 0 },
  { id: 'estudos', tipo: 'notas', nome: 'Notas de estudos', icone: '📝', ordem: 1, criadoEm: 0 },
  { id: 'leituras', tipo: 'livros', nome: 'Minhas leituras', icone: '📚', ordem: 2, criadoEm: 0 },
  { id: 'copa', tipo: 'figurinhas', nome: 'Figurinhas da Copa', icone: '⚽', ordem: 3, criadoEm: 0 },
  { id: 'rotina', tipo: 'skincare', nome: 'Skincare', icone: '🧴', ordem: 4, criadoEm: 0 },
];

export function useApps(): AppInstance[] {
  return [...SEED].sort((a, b) => a.ordem - b.ordem);
}

export function useApp(id: string): AppInstance | undefined {
  return useApps().find((app) => app.id === id);
}
