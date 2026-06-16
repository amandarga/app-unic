# Estado do Projeto — app-unic

Snapshot factual do estado atual. Mantido automaticamente a cada mudança
significativa (ver regra no `CLAUDE.md`).

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

## Estado (V0.2 — persistência + "+ Novo")

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

## Últimas mudanças grandes

1. **Moldura do "+ Novo":** virou **modal centralizado** (card no meio + fundo
   embaçado com `expo-blur`), substituindo a folha de baixo que travava no rodapé no
   iPhone/tablet. `GlobalBar` no grupo `(main)`; `novo` como `transparentModal`.
   Conteúdo das 2 etapas reaproveitado.
2. **V0.2:** persistência (`useStorage` + AsyncStorage; `useApps` sobre
   `apps:registro` com `addApp`) + fluxo "+ Novo" em 2 etapas que cria e persiste.
3. **V0.1:** Home/launcher navegável (grade + "Novo" + barra global + mini-app em
   tela cheia); substituiu o scaffold de 3 abas.
4. Decisão de arquitetura: o app é um **lançador** (docs reconciliados).
5. Downgrade SDK 56 → 54 + fix do tema (`@react-navigation/native`).

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
