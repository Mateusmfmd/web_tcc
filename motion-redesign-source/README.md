# Prévia React do M.O.T.I.O.N.

Esta é a fonte React + TypeScript da nova prévia. O build estático correspondente fica em `../motion-redesign/`; a antiga `../motion-web.html` foi preservada.

## Executar para desenvolvimento

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## Atualizar a página estática de revisão

```bash
pnpm install --frozen-lockfile
pnpm build:github
```

Esse comando compila a aplicação e atualiza `../motion-redesign/` com os arquivos de produção. Para abrir a página localmente, inicie um servidor HTTP na raiz do repositório e acesse `http://localhost:8000/motion-redesign/motion-web.html`.
