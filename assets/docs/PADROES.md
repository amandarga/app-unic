# Padrões de trabalho — app-unic

Regras fixas de como tocar este projeto. (Documentação do app vive em
`assets/docs/`. Arquivos especiais — `CLAUDE.md`, `AGENTS.md` — ficam na raiz
porque são lidos automaticamente de lá; só o `README.md` é o "índice" da raiz.)

## Fluxo de mudanças

- **Mostrar plano/diff antes de mudanças grandes** e esperar OK.
- **Confirmar ANTES de deletar/recriar/mover arquivos** — listar o que vai sumir.
- **Commitar e dar push só quando pedido.**
- Avançar em **versões** (V0.1, V0.2, ...), uma camada por vez. Ao fim de cada uma:
  1. rodar um **bundle** pra confirmar que compila;
  2. dizer **como testar**;
  3. atualizar o **`assets/docs/ESTADO-DO-PROJETO.md`**: snapshot curto no topo +
     um **bloco detalhado por versão** no `## Histórico de versões` (V0.1, V0.2, ...).
- Mudança significativa (dispara update do ESTADO): criar/avançar feature, mexer em
  dependência/SDK, mudar estrutura de pastas/rotas, decisão de arquitetura.
  NÃO conta: estilo, typo, refactor interno pequeno.

## Padrão de relato de commit (fixo)

Todo commit é reportado assim:

> **Commit:** `<hash_antes>..<hash_depois>` em `main` (+ rótulo de versão, ex. V0.3)
> **Antes → Depois:** o que era × o que ficou
> **O que foi feito:** resumo curto

## Comandos

```
npm run dev            # = expo start (QR p/ Expo Go)
npx expo start --clear # limpa o cache do Metro (após mover/renomear rotas)
npm run lint           # checagem de lint
```

Verificação de bundle (sem abrir o app), com o dev server no ar:

```
curl "http://localhost:8081/.expo/.virtual-metro-entry.bundle?platform=ios&dev=true"
```

## Gotchas

- **Porta 8081 presa (Windows):** um Metro de antes pode segurar a 8081 e servir o
  grafo de módulos velho. Matar o processo da 8081 e subir com `--clear` ao mexer em
  rotas.
- **Testar no Expo Go (iPhone)** via QR. Se sobrar Metro antigo, ele sobe na 8082 e
  o Expo Go não acha — fechar o antigo antes.

## O que NÃO mexer

- `app-unic-contexto.md` é da Amanda (mantido à mão).
- Não mover `CLAUDE.md` / `AGENTS.md` da raiz (perdem o carregamento automático).
