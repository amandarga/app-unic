# Estado do Projeto — app-unic

Snapshot factual do estado atual. Mantido automaticamente a cada mudança
significativa (ver regra no `CLAUDE.md`).

## Estrutura

```
app/                       # rotas finas (Expo Router)
  _layout.tsx              # Stack raiz
  (tabs)/
    _layout.tsx            # define as 3 abas (Tabs do expo-router)
    index.tsx             -> Skincare
    figurinhas.tsx        -> Figurinhas
    tarefas.tsx           -> Tarefas
src/
  features/
    skincare/   SkincareScreen.tsx, types.ts
    figurinhas/ FigurinhasScreen.tsx, types.ts
    tarefas/    TarefasScreen.tsx, types.ts
  components/   themed-text.tsx, themed-view.tsx
  hooks/        use-theme.ts, use-color-scheme.ts(.web)
  constants/    theme.ts
  global.css
```

## Stack e versões

- Expo **SDK 54** (`expo ^54.0.0`)
- `expo-router` ~6.0.24 · `react-native` 0.81.5 · `react`/`react-dom` 19.1.0
- TypeScript ~5.9.2 · `@types/react` ~19.1.10
- Tema: `@react-navigation/native` (v7) + hook próprio `useTheme`/`Colors`
- Outras deps presentes mas **sem uso direto** no app: reanimated ~4.1.1 +
  worklets 0.5.1, gesture-handler, screens, safe-area-context, expo-image, etc.
- **Persistência: AsyncStorage ainda NÃO instalado**; hook `useStorage` não existe.

## Estado das features

- **Skincare** (aba inicial): vazia — só título. Não persiste nada.
- **Figurinhas**: vazia — só título. Não persiste nada.
- **Tarefas**: vazia — só título. Não persiste nada.

## Decisões técnicas que afetam o código

- **Fixado no Expo SDK 54** (compatível com o Expo Go da App Store). Não atualizar
  o SDK por impulso.
- Barra de abas: componente **`Tabs` do `expo-router`** (tabs JS estáveis) — não
  NativeTabs.
- Ícones das abas via **emoji** (sem `@expo/vector-icons`).
- Alias **`@/` → `src/`** (e `@/assets/*` → `assets/*`).
- Rotas finas em `app/`, lógica em `src/features/` (regra de ouro do `CLAUDE.md`).
- Tema claro/escuro: `ThemeProvider` importado de `@react-navigation/native`
  (no SDK 54 não vem mais de `expo-router`).

## Últimas mudanças grandes

1. Fix: import do tema movido para `@react-navigation/native` (quebrava no SDK 54).
2. Downgrade SDK 56 → 54; removidos `@expo/ui`, `expo-glass-effect`,
   `expo-symbols` e 9 arquivos órfãos do template.
3. Scaffold das 3 abas: tab bar inferior + telas vazias; estrutura `app/` +
   `src/features/`.

## Pendências / pontos de atenção

- `useStorage` + AsyncStorage: criar quando a 1ª feature precisar persistir.
- Várias deps do template seguem instaladas sem uso direto; não remover sem
  conferir se alguma rota passa a usá-las.
- Sem `babel.config.js` / `metro.config.js` (usa os defaults do Expo).
