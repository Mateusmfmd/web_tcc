# M.O.T.I.O.N. — demonstração web

Página web demonstrativa do projeto **M.O.T.I.O.N.**, uma solução de tecnologia assistiva e comunicação alternativa.

## Conteúdo

- `motion-web.html`: página web estática para apresentação do projeto.

## Como executar

```bash
git clone https://github.com/Mateusmfmd/web_tcc.git
cd web_tcc
python3 -m http.server 8000
```

Abra `http://localhost:8000/motion-web.html` no navegador.


## Nova prévia React

A reformulação para avaliação fica em `motion-redesign/motion-web.html`. A página antiga `motion-web.html` foi mantida sem alterações. O código-fonte React, TypeScript e Vite está em `motion-redesign-source/`.

Na raiz do repositório, execute `python3 -m http.server 8000` e abra `http://localhost:8000/motion-redesign/motion-web.html` para conferir o build estático.

Para editar a fonte e atualizar esse build:

```bash
cd motion-redesign-source
pnpm install --frozen-lockfile
pnpm build:github
```
