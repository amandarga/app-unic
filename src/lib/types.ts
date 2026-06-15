// Tipos do núcleo do lançador (spec Fase 1, seção 8).

export type AppTypeId = 'checklist' | 'notas' | 'livros' | 'figurinhas' | 'skincare';

// Tipo (template): o modelo de um mini-app.
export interface AppTypeDef {
  id: AppTypeId;
  nome: string; // rótulo, ex.: "Notas"
  descricao: string; // 1 linha no seletor, ex.: "Texto livre"
  cor: string; // cor de identificação (hex) — FIXA por tipo
  iconePadrao: string; // emoji padrão
  instanciavel: boolean; // true = aparece no "+ Novo"; false = sob medida (bespoke)
}

// Instância: um mini-app criado a partir de um tipo.
export interface AppInstance {
  id: string; // uuid (na v0.1 são ids fixos da semente)
  tipo: AppTypeId;
  nome: string; // ex.: "Notas de estudos"
  icone: string; // emoji escolhido
  ordem: number; // posição na grade
  criadoEm: number; // timestamp
  // OBS: cor NÃO é guardada aqui — vem de AppTypeDef.cor (cor = tipo)
}

// Estado da barra global.
export type NavSlot =
  | { kind: 'sistema'; fn: 'buscar' } // função de sistema num slot flexível
  | { kind: 'app'; appId: string } // atalho fixado num slot flexível
  | { kind: 'vazio' }; // slot flexível sem nada

export interface NavbarState {
  // ordem fixa na UI: [Início, flex1, flex2, Perfil]
  // Início e Perfil são fixos e não ficam no estado.
  flex1: NavSlot; // padrão: { kind: 'sistema', fn: 'buscar' }
  flex2: NavSlot; // padrão: { kind: 'vazio' }
}
