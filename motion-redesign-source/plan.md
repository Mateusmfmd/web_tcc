# Plano — M.O.T.I.O.N.: comunicação que aproxima

## Escopo e abordagem

Reformular a prévia enviada em `motion-site-v3.zip` como um site infantil, acolhedor e visualmente marcante, mantendo o conteúdo do TCC, as fotos reais e as interações já implementadas. A referência do GitHub é `Mateusmfmd/web_tcc`; o trabalho será levado a uma branch de revisão, nunca diretamente à `main`. Primeiro o site será executado na prévia do Manus para a pessoa responsável avaliar; não há autorização para publicar ou fazer merge.

A base continuará em React, TypeScript e Vite. O código existente (Motion, Zustand, Recharts e Lucide) será reutilizado onde fizer sentido, em vez de reconstruir funcionalidades estáveis. A hierarquia visual ficará mais claramente infantil, com áreas de toque generosas, formas arredondadas com intenção e uma paleta que conversa com o azul do protótipo físico e os cartões coloridos do app. Textos em pt-BR serão revistos para soar diretos, carinhosos e naturais, sem clichês de produto ou frases genéricas. Os padrões de composição citados em `COMPONENTS.md` servirão de referência; nenhum código de componente será copiado sem licença compatível.

A seção do protótipo manterá o aparelho completo em 3D e ganhará uma galeria próxima com cinco botões físicos 3D individuais, um por cor do protótipo. Um modelo GLB de botão será reutilizado em instâncias Three.js separadas, com a cor aplicada a cada instância e cada peça tendo área clicável própria. Tocar ou ativar um botão no teclado sincroniza sua cor com a frase editável; uma explicação ao lado descreve a sequência: escolher um botão, associar/editar uma frase e ouvir/compartilhar a mensagem. A fotografia fornecida continua como referência e alternativa estática/acessível. O 3D é demonstrativo, não um modelo CAD para fabricação.

## Design

- **Movimento:** design editorial lúdico com referências táteis, inspirado em interfaces infantis bem acabadas e em componentes de interface contemporâneos, sem aparência de template genérico.
- **Princípios:** a criança entende o que pode fazer; o toque é fácil; brincadeira nunca atrapalha a comunicação; autenticidade e acessibilidade vêm antes da decoração.
- **Cores:** azul-cobalto do protótipo como assinatura; azul-marinho para estrutura e contraste; creme claro como superfície acolhedora; coral, amarelo e verde aparecem em ações e categorias reais do produto.
- **Layout:** narrativa vertical com hero assimétrico, foco no produto real e blocos editoriais alternados; manter quadros de app e gráfico em contextos identificáveis, sem transformar a página em dashboard genérico.
- **Assinaturas visuais:** cinco botões físicos tridimensionais em escala ampliada, ao lado de uma explicação clara do percurso da mensagem; cartões grandes que lembram o quadro de comunicação; pequenas etiquetas de pesquisa/demonstração para distinguir fatos, protótipos e dados ilustrativos.
- **Interação:** cada ação tem retorno claro; tocar um cartão acrescenta uma palavra, desfazer/limpar controla a frase, falar usa a voz pt-BR do navegador quando disponível, e cada botão físico mostra sua frase editável. Os cinco modelos 3D individuais acionam o mesmo estado de cor/frase dos controles por teclado e toque; o modelo do aparelho mantém alternativa fotográfica.
- **Animação:** movimentos breves e discretos para resposta de toque e entrada de conteúdo; sem animação contínua que distraia; respeitar `prefers-reduced-motion`.
- **Tipografia:** manter Work Sans para leitura e interface e Instrument Serif em títulos editoriais, com níveis curtos e grandes o bastante para uma experiência infantil legível.
- **Essência da marca:** um projeto de TCC que aproxima a criança de quem a escuta por caminhos de comunicação mais acessíveis. Personalidade: acolhedora, curiosa e respeitosa.
- **Voz:** falar com clareza, sem infantilizar a criança nem prometer resultados clínicos. Exemplos: “O que você quer dizer?” e “Escolher também é falar.”
- **Marca:** preservar o wordmark e o símbolo M.O.T.I.O.N. enviados; dar mais presença ao símbolo no cabeçalho sem desenhar outro logotipo.
- **Cor da marca:** azul-cobalto do aparelho, equilibrado pelo azul-marinho já usado no projeto.

## Estrutura do projeto

- `src/main.tsx`: entrada React e estilos globais.
- `src/App.tsx`: composição da landing page, navegação e seções.
- `src/components/`: componentes separados para visualizador do protótipo, quadro de comunicação, seções editoriais e mockups.
- `src/data.ts`: textos, cartões, módulos e dados rotulados de demonstração.
- `src/store.ts`: estado local persistido com salvaguardas e fala pt-BR.
- `src/styles.css` e `src/polish.css`: tokens, layout responsivo, foco, contraste e movimento reduzido.
- `public/hardware-real.png`: fotografia fornecida do protótipo.
- `public/motion-button.glb` e `public/aac-tactile-button.glb`: aparelho completo e modelo gerado de uma tecla individual, instanciada em cinco cores no visualizador.
- `src/components/ButtonGallery3D.tsx`: cena Three.js independente, carregamento do GLB, seleção por toque e feedback de pressão.
- `public/manus-routes.json`: manifesto da rota.
- `plan.md` e `TODO.md`: decisões aprovadas e entregas.

## Implementação e entrega

Importar o projeto Vite/React do ZIP na prévia gerenciada, preservar o lockfile e executar a instalação/build com a versão de pnpm declarada. Carregar o GLB com Three.js sem bloquear o restante da página; oferecer imagem de fallback caso WebGL não esteja disponível, o GLB falhe ou a pessoa prefira uma experiência estática. Registrar diagnósticos TypeScript antes da primeira edição de código, iniciar a prévia na porta configurada (3000), conferir `GET /manus-routes.json` e validar o build de produção.

Depois de revisar o diff contra a branch atual de `Mateusmfmd/web_tcc`, enviar apenas os arquivos da página para uma branch com nome de redesign, preservar arquivos não relacionados e confirmar o resultado remoto. A `main` permanecerá intacta até a aprovação explícita do usuário; nenhum merge ou publicação será iniciado nesta etapa.
