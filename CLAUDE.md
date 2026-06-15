# Meu App Pessoal

App nativo (React Native + Expo) de uso pessoal. É um **lançador (launcher)**:
a tela inicial (Home) é uma **grade de cards**, e cada card é um **mini-app** que
abre em tela cheia. O app é só meu — não tem usuários externos, não precisa de
login, e os dados ficam guardados localmente no meu próprio aparelho.

## Visão geral

A Home funciona como a tela inicial do celular: uma grade de mini-apps + um card
**"Novo"** no fim. Uma **barra global inferior** persiste em todas as telas (na
Home e dentro de cada mini-app). A lista de mini-apps cresce com o tempo, então o
projeto precisa ser fácil de estender: adicionar um **tipo** novo não pode
quebrar nem mexer nos outros.

A UI/UX completa da Fase 1 (a "casca") está em `assets/docs/ESPEC-UI-Fase-1.PDF`.

## Conceitos: tipo × instância

- **Tipo (template):** o modelo de um mini-app (ex.: `checklist`, `notas`,
  `livros`, `figurinhas`, `skincare`). Define a **cor** de identificação, o
  **ícone padrão** e o comportamento de dentro.
- **Instância:** um mini-app criado a partir de um tipo, com **nome e ícone
  próprios** (ex.: "Notas de estudos" é uma instância de `notas`). Pode haver
  **várias instâncias do mesmo tipo**.
- **Duas naturezas de tipo:**
  - **Instanciáveis** — aparecem no "+ Novo"; o usuário cria quantos quiser
    (`checklist`, `notas`, `livros`).
  - **Sob medida (bespoke)** — codados à mão e semeados no app, **não** aparecem
    no "+ Novo" (`figurinhas`, `skincare`).
- A **cor vem sempre do tipo**, nunca da instância. Acessibilidade: a cor nunca
  aparece sozinha — sempre acompanhada da etiqueta do tipo no card.

## Stack

- **React Native + Expo** (SDK 54) — app nativo de verdade.
- **TypeScript** em todo o código.
- **Expo Router** — navegação file-based. Cada arquivo em `app/` é uma rota.
- **Barra global inferior** persistente: `[ Início · slot · slot · Perfil ]`.
  Início e Perfil são âncoras fixas; os 2 slots do meio são customizáveis
  (função "Buscar", atalho pra um app fixado, ou vazio). **Não** é uma tab bar
  de seções.
- **Persistência local** — começa com AsyncStorage
  (`@react-native-async-storage/async-storage`), via um hook `useStorage`.
  Se uma feature precisar guardar muito dado (ex.: álbum de figurinhas com
  imagens), migrar só aquela feature para `expo-sqlite`.
- **Estilo** — StyleSheet nativo por padrão. Opção: NativeWind (Tailwind para RN)
  se eu pedir, já que tenho costume com Tailwind.
- **Sem backend** por enquanto. Tudo roda no aparelho. Não adicionar servidor,
  banco remoto ou autenticação sem eu pedir explicitamente.

## Estrutura de pastas

```
app/                   # SÓ as telas/rotas (finas), via Expo Router
  _layout.tsx          # stack raiz + barra global persistente
  index.tsx            # Home (launcher): grade de cards + card "Novo"
  app/
    [id].tsx           # abre um mini-app pelo id e delega ao tipo da instância
src/                   # toda a lógica de verdade vive aqui
  features/            # cada TIPO isolado (uma pasta por tipo)
    checklist/
      ChecklistScreen.tsx
      components/
      hooks/
      types.ts
    notas/
    livros/
    figurinhas/
    skincare/
  components/          # infra compartilhada: launcher, card, barra global, modal "+ Novo"
  hooks/               # hooks compartilhados (ex.: useStorage)
  lib/                 # utilidades + registro de tipos (mapa tipo → cor/ícone/...)
```

Regra de ouro: **os arquivos em `app/` são finos.** Cada **tipo** é uma feature
isolada em `src/features/<tipo>/` — toda a lógica, estado e componentes do tipo
moram lá. O **launcher (Home), o registro de apps, a barra global e o fluxo
"+ Novo"** são **infra compartilhada** (`src/components/`, `src/hooks/`,
`src/lib/`). Se algo é usado por dois ou mais tipos, sobe para a infra.

## Como adicionar um tipo novo

1. Criar `src/features/<tipo>/` com `‹Tipo›Screen.tsx` e o que o tipo precisar.
2. Registrar o tipo no mapa de tipos em `src/lib/` (id, nome, descrição, **cor**,
   ícone padrão, `instanciavel`).
3. Ligar o tipo ao renderizador da rota `app/app/[id].tsx`, que delega pelo
   `instance.tipo`.
4. Se for **instanciável**, ele passa a aparecer no "+ Novo" automaticamente;
   se for **sob medida**, semear a(s) instância(s) à mão.
5. Persistir o conteúdo do mini-app com `useStorage`, chave com prefixo por
   instância, ex.: `app:<id>:itens`.
6. Não tocar no código dos outros tipos.

## Persistência (estado da casca)

- `apps:registro` → `AppInstance[]` (os mini-apps da Home).
- `navbar:slots` → estado dos 2 slots flexíveis da barra global.
- A **cor não é guardada na instância** — vem do tipo.
- Conteúdo de cada mini-app: prefixo próprio por instância (`app:<id>:...`),
  definido na fase dos templates.

## Convenções

- TypeScript em tudo, com tipos explícitos para o estado de cada feature (`types.ts`).
- Componentes funcionais + hooks.
- Mobile-first (é o único alvo): layout pensado para celular.
- Componentes em PascalCase; hooks começando com `use`.
- Textos de interface em português (pt-BR).
- Cada chave de AsyncStorage sempre com prefixo da feature, para nunca colidir.
- Toda leitura/escrita de armazenamento passa pelo hook `useStorage`, nunca
  chamando o AsyncStorage cru espalhado pelo código.

## Manutenção do ESTADO-DO-PROJETO.md

Ao final de **toda mudança significativa**, atualize o `ESTADO-DO-PROJETO.md`
(na raiz) para refletir o novo estado.

**Conta como mudança significativa:**
- criar ou avançar uma feature (aba);
- instalar, remover ou atualizar dependência, ou trocar de SDK;
- mudar a estrutura de pastas ou de rotas;
- tomar uma decisão de arquitetura.

**NÃO conta:** ajuste de estilo, correção de typo, refactor interno pequeno.

Ao atualizar, mexa **só no que mudou** e mantenha o arquivo curto (é um snapshot,
não documentação). Não despeje código nele. Não tocar no `app-unic-contexto.md`
(é mantido à mão pela Amanda).

## Comandos

```
npx expo start         # inicia o dev server (QR code p/ abrir no Expo Go)
npx expo start --clear # idem, limpando o cache do bundler
npm run lint           # checagem de lint
```

## Features atuais

Tipos **instanciáveis** (aparecem no "+ Novo"):
- [ ] Checklist — itens pra marcar.
- [ ] Notas — texto livre.
- [ ] Livros — marcações e resenhas.

Tipos **sob medida** (semeados à mão, fora do "+ Novo"):
- [ ] Figurinhas da Copa — álbum/tabela: tenho, falta, repetidas.
- [ ] Skincare — rotina (manhã/noite), com passos marcáveis.

(Marcar conforme forem ficando prontos. Adicionar novos tipos aqui ao criá-los.)

## O que NÃO fazer sem eu pedir

- Adicionar backend, banco remoto ou login.
- Instalar bibliotecas pesadas para problemas simples.
- Refatorar vários tipos de uma vez. Mudanças focadas, um tipo por vez.
- Ejetar do fluxo gerenciado do Expo (bare workflow) sem necessidade real.
