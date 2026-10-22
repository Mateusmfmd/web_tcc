# M.O.T.I.O.N. — site de demonstração

Esta branch contém uma **prévia de integração** da reformulação React do projeto M.O.T.I.O.N. A página de entrada (`index.html` e `motion-web.html`) mostra a versão nova para avaliação; ela ainda não foi mesclada na `main`.

## Versões

- `motion-web.html` e `index.html`: prévia React integrada na raiz.
- `motion-web-legacy.html`: cópia da página que estava na `main` antes desta prévia, inclusive as interações e modelos 3D recentes. Os arquivos originais em `assets/` foram preservados.
- `motion-redesign-source/`: código React, TypeScript e Vite.
- `motion-redesign/`: cópia estática separada da prévia.

## Abrir localmente

Na raiz do repositório:

```bash
python3 -m http.server 8000
```

Acesse `http://localhost:8000/` ou `http://localhost:8000/motion-web.html`.

## Atualizar a prévia integrada

```bash
cd motion-redesign-source
pnpm install --frozen-lockfile
pnpm build:root-preview
```

O comando compila o React e sincroniza os arquivos para a raiz, preservando os modelos de hardware que já existem em `assets/`. Para atualizar somente a cópia isolada em `motion-redesign/`, use `pnpm build:github`.
