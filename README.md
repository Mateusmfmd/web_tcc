# M.O.T.I.O.N. — demonstração web

Página web demonstrativa do projeto **M.O.T.I.O.N.**, uma solução de tecnologia assistiva e comunicação alternativa para crianças, responsáveis e rede de cuidado.

## O que foi atualizado

- Interface responsiva inspirada nas telas atuais do aplicativo: modo criança, favoritos, rotina, emoções e modo responsável.
- Prévia interativa do aplicativo com abas e cartões de comunicação.
- Cena visual 3D leve com **Three.js**, sem necessidade de build ou instalação local.
- Entrada e microinterações com **GSAP**, respeitando a preferência por movimento reduzido no sistema.
- Linguagem visual mais acolhedora: cores suaves, cartões arredondados, alto contraste e navegação por teclado.
- Conteúdo preservado sobre aplicativo mobile, API, banco de dados e botão físico Arduino.

## Como executar

```bash
git clone https://github.com/Mateusmfmd/web_tcc.git
cd web_tcc
python3 -m http.server 8000
```

Abra `http://localhost:8000/motion-web.html` no navegador. A página usa Three.js e GSAP via CDN; para visualizar a cena 3D, o navegador precisa ter acesso à internet. O restante da página funciona como HTML/CSS/JavaScript estático.
