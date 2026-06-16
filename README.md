# App Unic

App nativo pessoal (React Native + Expo, SDK 54) — um **lançador**: a Home é uma
grade de cards (mini-apps), cada card abre em tela cheia, com uma barra global
inferior persistente. Uso próprio, sem login, dados locais no aparelho.

## Rodar

```bash
npm install
npm run dev      # abre o Expo (QR code p/ Expo Go)
```

Testar no celular: instale o **Expo Go** (App Store / Play Store) e escaneie o QR
(mesma rede Wi-Fi). No terminal: `w` abre no navegador, `a`/`i` em emulador.

## Documentação

- [Estado do projeto](assets/docs/ESTADO-DO-PROJETO.md) — snapshot atual (estrutura,
  stack, o que está pronto, pendências).
- [Padrões de trabalho](assets/docs/PADROES.md) — fluxo, comandos e convenções fixas.
- [Especificação de UI — Fase 1](assets/docs/ESPEC-UI-Fase-1.PDF) — a "casca".
- `CLAUDE.md` (raiz) — instruções de arquitetura para o assistente de código.

A documentação do app fica em `assets/docs/`.
