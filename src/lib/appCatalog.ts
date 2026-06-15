import type { AppTypeDef, AppTypeId } from '@/lib/types';

// Catálogo de tipos: mapa tipo → cor/ícone/comportamento. Só dados.
// Cores conforme sugestão da spec (seção 7).
export const APP_TYPES: Record<AppTypeId, AppTypeDef> = {
  checklist: {
    id: 'checklist',
    nome: 'Checklist',
    descricao: 'Itens pra marcar',
    cor: '#2F6FED', // azul
    iconePadrao: '✅',
    instanciavel: true,
  },
  notas: {
    id: 'notas',
    nome: 'Notas',
    descricao: 'Texto livre',
    cor: '#14A38B', // verde/teal
    iconePadrao: '📝',
    instanciavel: true,
  },
  livros: {
    id: 'livros',
    nome: 'Livros',
    descricao: 'Marcações e resenhas',
    cor: '#E08A1E', // laranja/âmbar
    iconePadrao: '📚',
    instanciavel: true,
  },
  figurinhas: {
    id: 'figurinhas',
    nome: 'Figurinhas',
    descricao: 'Álbum: tenho, falta, repetidas',
    cor: '#F2664A', // coral
    iconePadrao: '⚽',
    instanciavel: false,
  },
  skincare: {
    id: 'skincare',
    nome: 'Skincare',
    descricao: 'Rotina de cuidados',
    cor: '#EC6BA8', // rosa
    iconePadrao: '🧴',
    instanciavel: false,
  },
};

export function getAppType(id: AppTypeId): AppTypeDef {
  return APP_TYPES[id];
}

// Lista útil (ex.: o "+ Novo" no futuro filtra os instanciáveis).
export const APP_TYPE_LIST: AppTypeDef[] = Object.values(APP_TYPES);
