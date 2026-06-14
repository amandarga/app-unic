# Meu App Pessoal

App nativo (React Native + Expo) de uso pessoal, com várias abas independentes.
Cada aba é uma "feature" autocontida e diferente das outras. O app é só meu — não
tem usuários externos, não precisa de login, e os dados ficam guardados localmente
no meu próprio aparelho.

## Visão geral

A ideia é ter um único app que reúne coisas variadas que eu uso no dia a dia.
Exemplos de abas: rotina de skincare, tabela de figurinhas da Copa, tarefas do
trabalho. A lista de abas vai crescer com o tempo, então o projeto precisa ser
fácil de estender: adicionar uma aba nova não pode quebrar nem mexer nas outras.

## Stack

- **React Native + Expo** (template default, SDK atual) — app nativo de verdade.
- **TypeScript** em todo o código.
- **Expo Router** — navegação file-based. Cada arquivo em `app/` é uma tela.
- **Abas inferiores** via o layout de tabs do Expo Router.
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
  _layout.tsx          # stack raiz
  (tabs)/
    _layout.tsx        # define as abas e seus ícones
    index.tsx          # tela: Skincare
    figurinhas.tsx     # tela: Figurinhas
    tarefas.tsx        # tela: Tarefas
src/                   # toda a lógica de verdade vive aqui
  features/            # cada aba isolada
    skincare/
      SkincareScreen.tsx
      components/
      hooks/
      types.ts
    figurinhas/
    tarefas/
  components/          # componentes compartilhados
  hooks/               # hooks compartilhados (ex.: useStorage)
  lib/                 # utilidades genéricas
```

Regra de ouro: **os arquivos em `app/` são finos.** Eles só importam e renderizam
a tela correspondente de `src/features/<nome>/`. Toda a lógica, estado e
componentes de uma feature moram dentro da pasta dela em `src/features/`.
Se algo é usado por duas ou mais features, sobe para `src/components/`,
`src/hooks/` ou `src/lib/`.

## Como adicionar uma aba nova

1. Criar `src/features/<nome>/` com `‹Nome›Screen.tsx` e o que a feature precisar.
2. Criar a tela fina em `app/(tabs)/<nome>.tsx` que só renderiza essa screen.
3. Registrar a aba (ícone e título) em `app/(tabs)/_layout.tsx`.
4. Guardar o estado com `useStorage` usando chave com prefixo próprio, ex.:
   `skincare:rotina`, `figurinhas:album`, `tarefas:lista`.
5. Não tocar no código das outras features.

## Convenções

- TypeScript em tudo, com tipos explícitos para o estado de cada feature (`types.ts`).
- Componentes funcionais + hooks.
- Mobile-first (é o único alvo): layout pensado para celular.
- Componentes em PascalCase; hooks começando com `use`.
- Textos de interface em português (pt-BR).
- Cada chave de AsyncStorage sempre com prefixo da feature, para nunca colidir.
- Toda leitura/escrita de armazenamento passa pelo hook `useStorage`, nunca
  chamando o AsyncStorage cru espalhado pelo código.

## Comandos

```
npx expo start         # inicia o dev server (QR code p/ abrir no Expo Go)
npx expo start --clear # idem, limpando o cache do bundler
npm run lint           # checagem de lint
```

## Features atuais

- [ ] Skincare — rotina (manhã/noite), com passos marcáveis.
- [ ] Figurinhas da Copa — álbum/tabela do que tenho, falta e repetidas.
- [ ] Tarefas do trabalho — lista de tarefas simples.

(Marcar conforme forem ficando prontas. Adicionar novas linhas aqui ao criar
abas novas.)

## O que NÃO fazer sem eu pedir

- Adicionar backend, banco remoto ou login.
- Instalar bibliotecas pesadas para problemas simples.
- Refatorar várias features de uma vez. Mudanças focadas, uma feature por vez.
- Ejetar do fluxo gerenciado do Expo (bare workflow) sem necessidade real.