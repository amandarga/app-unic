# Estado do Projeto — app-unic

Snapshot factual do estado atual. Mantido automaticamente a cada mudança
significativa (ver regra no `CLAUDE.md`).

## Estrutura

```
app/                       # rotas finas (Expo Router)
  _layout.tsx              # Stack raiz + GlobalBar persistente
  index.tsx               -> LauncherScreen (Home)
  app/
    [id].tsx              -> MiniAppHost (mini-app em tela cheia)
src/
  lib/
    types.ts              # AppTypeDef, AppInstance, NavSlot, NavbarState (spec §8)
    appCatalog.ts         # APP_TYPES (5 tipos) + getAppType
  hooks/
    useApps.ts            # semente FIXA de instâncias (ainda sem storage)
    use-theme.ts, use-color-scheme.ts(.web)
  components/
    LauncherScreen.tsx, AppCard.tsx, NewCard.tsx, GlobalBar.tsx, MiniAppHost.tsx
    themed-text.tsx, themed-view.tsx
  features/
    skincare/ (stub), figurinhas/ (stub)   # interiores na fase 2
  constants/  theme.ts
  global.css
```

## Stack e versões

- Expo **SDK 54** (`expo ^54.0.0`)
- `expo-router` ~6.0.24 · `react-native` 0.81.5 · `react`/`react-dom` 19.1.0
- TypeScript ~5.9.2 · `@types/react` ~19.1.10
- Tema: `@react-navigation/native` (v7) + hook próprio `useTheme`/`Colors`
- **Persistência: AsyncStorage ainda NÃO instalado**; hook `useStorage` não existe
  (a v0.1 usa dados em memória via `useApps`).

## Estado (V0.1 — "a Home que abre")

A casca está **visível e navegável**, sem persistir nada e sem criar/editar.

- **Home (launcher):** grade de cards lendo de `useApps()` + card "Novo".
  Barra superior (pesquisar/editar) é só visual inerte. "Novo" mostra "em breve".
- **Mini-app em tela cheia** (`/app/[id]`): mostra nome + tipo no topo e corpo
  placeholder ("conteúdo em breve"). Interior dos tipos = fase 2.
- **Barra global** persistente `[Início · Buscar · Slot · Perfil]`: só **Início**
  funciona (volta pra Home); o resto é visual/inerte.
- **Catálogo de tipos** (5): `checklist`, `notas`, `livros` (instanciáveis);
  `figurinhas`, `skincare` (sob medida). Cores conforme spec §7.
- **Semente:** 5 instâncias fixas em `useApps` (Mercado, Notas de estudos,
  Minhas leituras, Figurinhas da Copa, Skincare).

## Decisões técnicas que afetam o código

- **Modelo = lançador (launcher)** (spec `assets/docs/ESPEC-UI-Fase-1.PDF`):
  Home em grade de cards; mini-app abre em tela cheia; **tipo** define
  cor/ícone/comportamento, **instância** é criada de um tipo. **Cor vem do tipo**,
  nunca da instância (lida do catálogo).
- **`useApps()` é a costura de dados** — devolve a semente fixa agora; na v0.2
  passa a ler do AsyncStorage **sem a Home mudar**.
- **Barra global no layout raiz** (`app/_layout.tsx`), fora do Stack, pra aparecer
  igual na Home e sobre o mini-app.
- Rota dinâmica do mini-app: **`app/app/[id].tsx`** (URL `/app/:id`).
- **Fixado no Expo SDK 54** (compatível com o Expo Go da App Store). Não atualizar
  o SDK por impulso.
- Ícones (cards e barra) via **emoji** (sem `@expo/vector-icons`).
- Alias **`@/` → `src/`**. Rotas finas em `app/`; cada **tipo** isolado em
  `src/features/<tipo>/`; launcher/card/barra são infra em `src/components`.

## Últimas mudanças grandes

1. **V0.1 do launcher:** substitui o scaffold de 3 abas pela Home navegável
   (grade + card "Novo" + barra global + mini-app em tela cheia). Sem persistência.
   Deletados `app/(tabs)/` e `src/features/tarefas/`; skincare/figurinhas viram stubs.
2. Decisão de arquitetura: o app passa a ser um **lançador** (docs reconciliados).
3. Fix: import do tema movido para `@react-navigation/native` (quebrava no SDK 54).
4. Downgrade SDK 56 → 54; removidos `@expo/ui`, `expo-glass-effect`,
   `expo-symbols` e arquivos órfãos do template.

## Pendências / pontos de atenção

- **v0.2+ (ordem da spec §9):** AsyncStorage + `useStorage` (`apps:registro`,
  `navbar:slots`) → fluxo "+ Novo" → modo editar → slots customizáveis/long-press
  → filtro e pesquisa funcionais.
- **Fase 2:** interiores dos tipos — ligar `MiniAppHost` ao `src/features/<tipo>/`.
- `src/features/skincare` e `figurinhas` são **stubs** não usados ainda.
- Sem `babel.config.js` / `metro.config.js` (usa os defaults do Expo).
