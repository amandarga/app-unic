# Estado do Projeto — app-unic

Documentação viva do projeto: um **snapshot** do estado atual (estrutura, stack,
capacidades, decisões) no topo + um **histórico detalhado por versão** no fim.
Atualizado a cada mudança significativa (ver regra no `CLAUDE.md`).

## Estrutura

```
app/                       # rotas finas (Expo Router)
  _layout.tsx              # Stack raiz: grupo (main) + rota novo (transparentModal)
  novo.tsx                -> BlurView (fundo) + card centralizado + NovoAppScreen
  (main)/                  # grupo: Home + mini-apps + GlobalBar (não muda a URL)
    _layout.tsx            # View{ Stack(index, app/[id]) + GlobalBar persistente }
    index.tsx             -> LauncherScreen (Home)
    app/
      [id].tsx            -> MiniAppHost (mini-app em tela cheia)
src/
  lib/
    types.ts              # AppTypeDef, AppInstance, NavSlot, NavbarState (spec §8)
    appCatalog.ts         # APP_TYPES (5 tipos) + getAppType
    id.ts                 # gerarId()
  hooks/
    useStorage.ts         # genérico: [valor, setValor, carregando] + sync por chave
    useApps.ts            # { apps, addApp, carregando } sobre 'apps:registro'
    use-theme.ts, use-color-scheme.ts(.web)
  components/
    LauncherScreen.tsx, AppCard.tsx, NewCard.tsx, GlobalBar.tsx, MiniAppHost.tsx
    novo/ NovoAppScreen.tsx, EtapaTipo.tsx, DetalhesForm.tsx
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
- **Persistência: `@react-native-async-storage/async-storage` instalado**, acessado
  só via o hook `useStorage`.
- **`expo-blur`** instalado (fundo embaçado do "+ Novo").

## Estado atual (V0.2.1)

A casca é navegável **e já cria/persiste** mini-apps (ainda sem editar/excluir).

- **Persistência:** `useStorage` (AsyncStorage, JSON, semente-no-primeiro-uso,
  sincronia entre telas por chave). `useApps` lê/grava `apps:registro`.
- **Home (launcher):** grade lendo de `useApps()` + card "Novo". Barra superior
  (pesquisar/editar) ainda só visual.
- **"+ Novo" (funcional):** card "Novo" abre um **modal centralizado** sobre fundo
  **embaçado** (Home + barra atrás): card no meio da tela (largura ~90%, máx 420px),
  altura = conteúdo (máx 85%, com `ScrollView` interno), tocar fora fecha. Em 2 etapas
  — escolher tipo (só instanciáveis) → detalhes (prévia ao vivo reusando `AppCard`,
  nome, fileira de emojis, cor read-only) → "Criar app" persiste e aparece na Home.
- **Mini-app em tela cheia** (`/app/[id]`): nome + tipo no topo + placeholder.
  Interior dos tipos = fase 2.
- **Barra global** persistente `[Início · Buscar · Slot · Perfil]`: só Início
  funciona; "Slot" mostra quadradinho tracejado (placeholder vazio).
- **Catálogo** (5 tipos): `checklist`, `notas`, `livros` (instanciáveis);
  `figurinhas`, `skincare` (sob medida).

## Decisões técnicas que afetam o código

- **Modelo = lançador** (spec `assets/docs/ESPEC-UI-Fase-1.PDF`). **Cor vem do tipo**
  (catálogo), nunca da instância.
- **`useStorage` é o único ponto de acesso ao AsyncStorage** (regra do CLAUDE.md);
  tem camada de assinatura em memória por chave → consumidores da mesma chave ficam
  em sincronia (app criado no modal aparece na Home na hora). Semente-no-primeiro-uso.
- **`useApps()` devolve `{ apps, addApp, carregando }`** — é a costura de dados.
- **`DetalhesForm` é reutilizável** (será o formulário de editar na v0.3).
- **Layout em 2 níveis:** a `GlobalBar` vive no grupo **`app/(main)/_layout.tsx`**
  (envolve Home + mini-apps); a rota **`novo`** é **`transparentModal` no layout raiz**,
  acima do `(main)`, por isso cobre/embaça a barra. URLs não mudam (grupo entre `()`).
- **"+ Novo" = modal CENTRALIZADO** (não folha de baixo — a folha travava colada no
  rodapé no iPhone/tablet). `BlurView` (expo-blur) de fundo + card centrado
  (flex center, maxWidth 420, maxHeight 85% com `ScrollView`), dentro de um
  `KeyboardAvoidingView` (`padding` no iOS) pro teclado não cobrir o "Nome".
  Sem gesto de arrastar-pra-fechar.
- **Fixado no Expo SDK 54** (compatível com o Expo Go da App Store). Não atualizar
  por impulso.
- Ícones via **emoji**; alias **`@/` → `src/`**; rotas finas em `app/`; tipos isolados
  em `src/features/<tipo>/`; launcher/card/barra/modal são infra em `src/components`.

## Histórico de versões

Registro detalhado, em ordem cronológica (mais antigo primeiro). Ao subir uma
versão nova, adicione um bloco no fim.

### Base — setup (pré-launcher)
- Scaffold inicial Expo com 3 abas (Skincare/Figurinhas/Tarefas) — depois
  substituído pelo modelo de lançador.
- **Downgrade Expo SDK 56 → 54** (compatível com o Expo Go da App Store):
  `expo ^54`, `react-native` 0.81.5, `react` 19.1.0, `expo-router` 6; removidos
  `@expo/ui`, `expo-glass-effect`, `expo-symbols` e arquivos órfãos do template;
  ajuste de `typescript`/`@types/react`.
- **Fix de tema:** `ThemeProvider`/`DarkTheme`/`DefaultTheme` passam a vir de
  `@react-navigation/native` (no SDK 54 não são mais reexportados de `expo-router`).
- **Decisão de arquitetura:** o app vira um **lançador** (Home em grade de cards +
  barra global; tipos × instâncias). Docs (`CLAUDE.md`/`ESTADO`) reconciliados;
  spec em `assets/docs/ESPEC-UI-Fase-1.PDF`.

### V0.1 — "A Home que abre"
A casca visível e navegável, sem persistência e sem criar/editar.
- **Catálogo de tipos** (`src/lib/`): `types.ts` (`AppTypeDef`, `AppInstance`,
  `NavSlot`, `NavbarState`) + `appCatalog.ts` (5 tipos com cor/emoji/`instanciavel`).
- **`useApps()`** com semente fixa (em memória, sem storage) — costura de dados.
- **Componentes** (`src/components/`): `AppCard` (faixa de cor + etiqueta sempre +
  emoji + nome), `NewCard`, `GlobalBar` (`Início·Buscar·Slot·Perfil`, só Início
  funciona), `LauncherScreen` (grade + topo inerte), `MiniAppHost` (nome + tipo +
  placeholder).
- **Rotas finas:** `app/index.tsx` (Home), `app/app/[id].tsx` (mini-app),
  `app/_layout.tsx` com a barra global. Removeu o scaffold de 3 abas e a feature
  `tarefas`; `skincare`/`figurinhas` viraram stubs.

### V0.2 — Persistência + "+ Novo"
A casca passa a **criar e persistir** mini-apps (ainda sem editar/excluir).
- **`@react-native-async-storage/async-storage`** instalado.
- **`useStorage`** (`src/hooks/`): genérico `[valor, setValor, carregando]`, JSON,
  semente-no-primeiro-uso e **sincronia entre telas por chave**; único ponto de
  acesso ao AsyncStorage.
- **`useApps()`** passa a ler/gravar `apps:registro` via `useStorage` e ganha
  **`addApp()`**; retorna `{ apps, addApp, carregando }`. `src/lib/id.ts` (`gerarId`).
- **Fluxo "+ Novo"** (rota modal): `NovoAppScreen` (2 etapas + indicador),
  `EtapaTipo` (só instanciáveis), `DetalhesForm` **reutilizável** (prévia ao vivo
  via `AppCard`, nome, fileira de emojis, cor read-only) → `addApp()` cria e persiste.
- `AppCard` ganha prop `disabled` (prévia não-tocável); `GlobalBar`: ícone do slot
  vazio vira **quadradinho tracejado**.

### V0.2.1 — "+ Novo" como modal centralizado
Só a moldura do "+ Novo" (conteúdo das etapas reaproveitado).
- **`expo-blur`** instalado: fundo embaçado (Home + barra atrás).
- **Reorg de layout em 2 níveis:** `GlobalBar` movida pro grupo `app/(main)/`
  (envolve Home + mini-apps); rota `novo` vira **`transparentModal`** no layout raiz,
  acima do `(main)`, por isso cobre/embaça a barra. URLs inalteradas (`git mv`).
- **"+ Novo" deixa de ser folha de baixo** (travava colada no rodapé no
  iPhone/tablet) e vira **modal CENTRALIZADO**: card no meio (largura ~90%, máx
  420px, `maxHeight` 85% com `ScrollView`), dentro de `KeyboardAvoidingView`
  (`padding` no iOS); tocar fora fecha. Cabeçalho com "Etapa X de 2" + barra de
  progresso.
- **Fix nativo:** `flexShrink:1` (não `flex:1`) no card/scrolls — `flex:1` colapsava
  a altura no Yoga nativo (pai de altura automática), por isso só o blur aparecia.
- **Organização do repo:** documentação movida pra `assets/docs/`
  (`ESTADO-DO-PROJETO.md`, `PADROES.md`); raiz só com `README.md` + os especiais
  `CLAUDE.md`/`AGENTS.md`.

## Pendências / pontos de atenção

- **v0.3+:** modo editar (`−`/lápis, confirmação ao excluir) reusando `DetalhesForm`;
  slots customizáveis/long-press; filtro por tipo; pesquisa funcional.
- **Fase 2:** interiores dos tipos — ligar `MiniAppHost` ao `src/features/<tipo>/`
  e persistir conteúdo em `app:<id>:...`.
- "+ Novo": fecha tocando fora do card (sem gesto de arrastar, por decisão). No
  Android o blur depende de `experimentalBlurMethod` (iOS é nativo).
- `navbar:slots` ainda não persistido (barra é fixa por ora).
- `src/features/skincare` e `figurinhas` são **stubs** não usados ainda.
- Sem `babel.config.js` / `metro.config.js` (usa os defaults do Expo).
