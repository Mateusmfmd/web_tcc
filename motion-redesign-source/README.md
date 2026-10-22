# Fonte React do M.O.T.I.O.N.

Esta pasta contém a fonte React, TypeScript e Vite da reformulação. Na branch de avaliação, o build também é integrado à raiz do `web_tcc`; `motion-web-legacy.html` preserva a página anterior para comparação. A pasta `../motion-redesign/` continua disponível como demonstração estática isolada.

## Desenvolvimento

```bash
pnpm install --frozen-lockfile
pnpm dev
```

## Gerar a prévia integrada na raiz do `web_tcc`

```bash
pnpm install --frozen-lockfile
pnpm build:root-preview
```

O comando atualiza `../index.html`, `../motion-web.html` e os arquivos do build. Não remove outros arquivos em `../assets/`, inclusive os modelos de hardware da versão anterior.

## Atualizar a cópia estática isolada

```bash
pnpm install --frozen-lockfile
pnpm build:github
```

Esse comando atualiza `../motion-redesign/`; para abri-la, inicie um servidor HTTP na raiz do repositório e acesse `http://localhost:8000/motion-redesign/motion-web.html`.
