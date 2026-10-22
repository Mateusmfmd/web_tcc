import { createElement, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import {
  ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Bell, CalendarDays, Check,
  ChevronDown, ChevronRight, Heart, Menu, Mic, RotateCcw, ShieldCheck,
  Sparkles, Star, Volume2, X,
} from 'lucide-react'
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { PhoneUI } from './mockups'
import {
  boardCards, buttonOrder, modules, pathSteps, weeklyData,
  type BoardCategory, type ButtonColor,
} from './data'
import { useMotionStore } from './store'
const HardwareViewer = lazy(() => import('./components/HardwareViewer').then((module) => ({ default: module.HardwareViewer })))
const ButtonGallery3D = lazy(() => import('./components/ButtonGallery3D').then((module) => ({ default: module.ButtonGallery3D })))

const navItems = [
  { href: '#produto', label: 'O projeto' },
  { href: '#interacao', label: 'Botão físico' },
  { href: '#quadro', label: 'Quadro de comunicação' },
  { href: '#modulos', label: 'O aplicativo' },
]
const categories: BoardCategory[] = ['necessidades', 'emoções', 'pessoas', 'ações']
const categoryNames: Record<BoardCategory, string> = {
  necessidades: 'Preciso de', emoções: 'Como me sinto', pessoas: 'Quero falar com', ações: 'Quero fazer',
}
const categoryClasses: Record<BoardCategory, string> = {
  necessidades: 'need', emoções: 'feeling', pessoas: 'people', ações: 'action',
}
const colorNames: Record<ButtonColor, string> = {
  vermelho: 'Vermelho', amarelo: 'Amarelo', verde: 'Verde', azul: 'Azul', preto: 'Preto',
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <span className={`eyebrow${light ? ' eyebrow-light' : ''}`}>{children}</span>
}

function SectionHeading({ label, title, text, light = false }: {
  label: string; title: string; text: string; light?: boolean
}) {
  return (
    <div className={`section-heading${light ? ' section-heading-light' : ''}`}>
      <Eyebrow light={light}>{label}</Eyebrow>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}

function DemoBadge({ children = 'Demonstração' }: { children?: ReactNode }) {
  return <span className="demo-badge"><span aria-hidden="true" />{children}</span>
}

function Reveal({ children, className, delay = 0 }: {
  children: ReactNode; className?: string; delay?: number
}) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function Header({ onMenu }: { onMenu: () => void }) {
  const { mode, setMode } = useMotionStore()
  const nextMode = mode === 'child' ? 'professional' : 'child'
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="wordmark" href="#top" aria-label="M.O.T.I.O.N. — início">
          <span className="wordmark-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>M.O.T.I.O.N.</span>
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="header-actions">
          <button
            className={`mode-toggle mode-${mode}`}
            onClick={() => setMode(nextMode)}
            aria-label={`Alternar para modo ${nextMode === 'child' ? 'criança' : 'responsável'}`}
            title="Alternar modo de visualização"
          >
            <span className="mode-toggle-dot" aria-hidden="true" />
            <span>{mode === 'child' ? 'Modo criança' : 'Modo responsável'}</span>
          </button>
          <a className="button button-small button-blue header-cta" href="#quadro">
            Experimentar <ArrowUpRight size={15} />
          </a>
          <button className="icon-button mobile-menu" aria-label="Abrir menu" onClick={onMenu}>
            <Menu size={19} />
          </button>
        </div>
      </div>
    </header>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <motion.aside
      className="mobile-menu-panel"
      aria-label="Navegação móvel"
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
    >
      <div className="mobile-menu-top">
        <Eyebrow>Navegação</Eyebrow>
        <button className="icon-button mobile-close" aria-label="Fechar menu" onClick={onClose}><X size={20} /></button>
      </div>
      <nav>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={onClose}>{item.label}<ArrowUpRight size={19} /></a>
        ))}
      </nav>
      <p>Um projeto que abre mais caminhos para a conversa.</p>
    </motion.aside>
  )
}

function Hero() {
  const { mode } = useMotionStore()
  const isChildMode = mode === 'child'
  return (
    <section className="hero" id="top">
      <div className="shell hero-grid">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          <Eyebrow>TCC · ETEC de São Paulo · Tecnologia assistiva</Eyebrow>
          <h1>Toda criança <em>tem o que dizer.</em></h1>
          <p className="hero-lead">
            Figuras, voz e um botão físico. O M.O.T.I.O.N. junta caminhos diferentes para a criança
            dizer o que quer, sente e precisa.
          </p>
          <div className="hero-actions">
            <a className="button button-coral" href="#quadro">Experimentar o quadro <ArrowDown size={16} /></a>
            <a className="text-link hero-secondary" href="#produto">Conhecer o projeto <ArrowRight size={16} /></a>
          </div>
          <div className="hero-note" aria-live="polite">
            <span className="hero-note-mark"><Sparkles size={17} /></span>
            <span>{isChildMode ? 'Um toque também pode ser uma palavra.' : 'Mais caminhos para conversar, no ritmo de cada criança.'}</span>
          </div>
          <div className="hero-facts" aria-label="Sobre o projeto">
            <div><strong>5</strong><span>botões físicos</span></div>
            <div><strong>7</strong><span>módulos do app</span></div>
            <div><strong>1</strong><span>ideia: participar</span></div>
          </div>
        </motion.div>
        <motion.div
          className="hero-art"
          initial={{ opacity: 0, scale: 0.96, rotate: 1.5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.65, delay: 0.08 }}
        >
          <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
          <div className="hero-sticker sticker-speech"><Volume2 size={15} /> A minha voz</div>
          <div className="hero-sticker sticker-choice"><span aria-hidden="true">✓</span> Eu escolho</div>
          <div className="hero-phone-card">
            <div className="hero-phone-top">
              <span className="phone-avatar" aria-hidden="true">A</span>
              <span><strong>Oi, Ana!</strong><small>o que você quer dizer?</small></span>
              <span className="phone-sound" aria-hidden="true"><Volume2 size={17} /></span>
            </div>
            <div className="phone-phrase"><small>MINHA FRASE</small><strong>Eu quero brincar</strong></div>
            <div className="hero-phone-tiles" aria-label="Exemplo ilustrativo de cartões de comunicação">
              <div className="phone-tile tile-coral"><span>🍎</span><b>Comer</b></div>
              <div className="phone-tile tile-blue"><span>💧</span><b>Água</b></div>
              <div className="phone-tile tile-yellow"><span>😊</span><b>Feliz</b></div>
              <div className="phone-tile tile-green"><span>🧩</span><b>Brincar</b></div>
            </div>
            <div className="hero-phone-footer"><span /> Prévia ilustrativa do aplicativo</div>
          </div>
          <span className="hero-art-caption">Uma ideia que começa com uma escolha.</span>
        </motion.div>
      </div>
      <a className="hero-scroll" href="#produto"><span>Continue por aqui</span><ChevronDown size={16} /></a>
    </section>
  )
}

function ProductIntro() {
  return (
    <section className="section intro-section" id="produto">
      <div className="shell intro-layout">
        <div className="intro-index">01 <span>O projeto</span></div>
        <div className="intro-main">
          <SectionHeading
            label="Comunicação aumentativa e alternativa"
            title="Nem toda conversa começa com palavras."
            text="Às vezes começa com uma figura, um olhar ou um botão. O M.O.T.I.O.N. foi pensado para aproximar essas escolhas de quem pode escutar e responder."
          />
          <blockquote className="quote-block">
            <span aria-hidden="true">“</span><p>Escolher também é falar.</p><cite>Uma ideia que guia o projeto</cite>
          </blockquote>
        </div>
        <aside className="intro-aside" aria-label="Pontos principais do projeto">
          <div className="intro-fact"><span className="fact-number">01</span><p>Uma interface com figuras, frases e fala.</p></div>
          <div className="intro-fact"><span className="fact-number">02</span><p>Um botão físico como outro jeito de participar.</p></div>
          <div className="intro-fact"><span className="fact-number">03</span><p>Uma proposta criada a partir de um TCC.</p></div>
        </aside>
      </div>
    </section>
  )
}

function DeferredHardwareViewer({ onSelectButton }: { onSelectButton: (color: ButtonColor) => void }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) { setReady(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect() }
    }, { rootMargin: '250px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const photo = <img className="hardware-fallback-photo" src={`${import.meta.env.BASE_URL}hardware-real.png`} alt="Protótipo físico azul com cinco botões coloridos e seis conectores" />

  return (
    <div ref={stageRef} className="hardware-lazy-frame">
      {ready ? (
        <Suspense fallback={<div className="hardware-viewer">{photo}<span className="viewer-status"><span />Preparando o modelo 3D.</span></div>}>
          <HardwareViewer onSelectButton={onSelectButton} />
        </Suspense>
      ) : (
        <div className="hardware-viewer">
          {photo}
          <span className="viewer-status"><span />A foto aparece agora; o 3D carrega nesta seção.</span>
          <button className="viewer-photo-toggle" type="button" onClick={() => setReady(true)}>Carregar modelo 3D</button>
        </div>
      )}
    </div>
  )
}

function ButtonExperience() {
  const { buttonPhrases, setButtonPhrase, speakPhrase } = useMotionStore()
  const [selected, setSelected] = useState<ButtonColor>('amarelo')
  const [draft, setDraft] = useState(buttonPhrases.amarelo)
  const [status, setStatus] = useState('')

  useEffect(() => { setDraft(buttonPhrases[selected]) }, [buttonPhrases, selected])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const index = Number(event.key) - 1
      if (index >= 0 && index < buttonOrder.length) {
        setSelected(buttonOrder[index])
        setStatus(`Botão ${colorNames[buttonOrder[index]].toLowerCase()} selecionado.`)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const choose = (color: ButtonColor) => {
    setSelected(color)
    setDraft(buttonPhrases[color])
    setStatus(`Botão ${colorNames[color].toLowerCase()} selecionado.`)
  }

  const saveAndSpeak = () => {
    const phraseText = draft.trim()
    if (!phraseText) { setStatus('Escreva uma frase antes de salvar.'); return }
    setButtonPhrase(selected, phraseText)
    if ('speechSynthesis' in window) {
      speakPhrase(phraseText)
      setStatus('Frase salva. O navegador está falando em português.')
    } else setStatus('Frase salva. Este navegador não oferece fala automática.')
  }

  return (
    <section className="section button-section" id="interacao">
      <div className="shell">
        <div className="section-intro-row">
          <SectionHeading
            label="O botão físico"
            title="Um toque pode começar uma conversa."
            text="Este é o protótipo do TCC. Cada cor pode guardar uma frase escolhida para a rotina da criança."
          />
          <span className="section-number">02 / 05</span>
        </div>
        <div className="hardware-card">
          <div className="hardware-visual">
            <div className="hardware-visual-top">
              <span><span className="status-light" /> Protótipo M.O.T.I.O.N.</span>
              <DemoBadge>Modelo demonstrativo</DemoBadge>
            </div>
            <DeferredHardwareViewer onSelectButton={choose} />
            <div className="hardware-caption">
              <span>Gire com o mouse ou com o dedo</span>
              <span>Foto real do protótipo <a href="#pesquisa">ver contexto</a></span>
            </div>
          </div>
          <div className="hardware-controls">
            <div className="hardware-controls-heading">
              <Eyebrow>Agora é a sua vez</Eyebrow>
              <h3>O que este botão diz?</h3>
              <p>Escolha uma cor e experimente uma frase.</p>
            </div>
            <div className="button-picker" role="group" aria-label="Escolher um botão físico">
              {buttonOrder.map((color, index) => (
                <button
                  key={color} type="button"
                  className={`button-choice key-${color}${selected === color ? ' is-selected' : ''}`}
                  onClick={() => choose(color)} aria-pressed={selected === color}
                  aria-label={`Botão ${colorNames[color]}, número ${index + 1}`}
                  title={`${index + 1}. ${colorNames[color]}`}
                >
                  <span className="button-choice-number">{index + 1}</span>
                  <span className="button-choice-label">{colorNames[color]}</span>
                </button>
              ))}
            </div>
            <label className="field-label" htmlFor="button-phrase">Frase deste botão</label>
            <textarea id="button-phrase" value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} maxLength={100} />
            <div className="panel-actions">
              <button type="button" className="button button-blue" onClick={saveAndSpeak}><Volume2 size={17} /> Salvar e ouvir</button>
              <button
                type="button" className="button button-quiet"
                onClick={() => { setDraft(buttonPhrases[selected]); setStatus('Frase original restaurada.') }}
              ><RotateCcw size={15} /> Restaurar</button>
            </div>
            <p className="keyboard-hint">Também dá para escolher pelas teclas 1 a 5.</p>
            <ol className="button-how-steps" aria-label="Como funciona">
              <li><b>Escolha</b><span>Toque numa das cinco teclas.</span></li>
              <li><b>Monte</b><span>Ajuste a frase ligada à cor.</span></li>
              <li><b>Comunique</b><span>Salve e ouça a mensagem em voz alta.</span></li>
            </ol>
            <p className="sr-only" role="status" aria-live="polite">{status}</p>
          </div>
        </div>
        <div className="individual-buttons">
          <div className="individual-buttons-heading">
            <div>
              <Eyebrow>As cinco teclas</Eyebrow>
              <h3>Veja cada botão de perto.</h3>
            </div>
            <span>Toque numa tecla; no celular, deslize para ver todas.</span>
          </div>
          <div className="button-gallery-scroll" role="region" aria-label="Galeria dos cinco botões físicos em 3D" tabIndex={0}>
            <div className="button-gallery-track">
              <DeferredButtonGallery selectedColor={selected} onSelectButton={choose} />
              <div className="button-gallery-captions" aria-hidden="true">
                {buttonOrder.map((color, index) => (
                  <span key={color} className={`key-${color}${selected === color ? ' is-selected' : ''}`}>
                    <b>{index + 1}</b>{colorNames[color]}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="button-gallery-status" aria-live="polite">
            Tecla {colorNames[selected].toLowerCase()} selecionada. A frase correspondente aparece no campo acima.
          </p>
        </div>
        <TechnicalModelSection />
      </div>
    </section>
  )
}

const technicalModels = [
  {
    title: 'Botão tátil',
    description: 'A peça física que a criança pode acionar.',
    src: 'assets/botao-tatil.glb',
    alt: 'Modelo 3D interativo do botão tátil do M.O.T.I.O.N.',
  },
  {
    title: 'Sensor ultrassônico',
    description: 'Um componente do protótipo para leitura por proximidade.',
    src: 'assets/sensor-ultrassonico.glb',
    alt: 'Modelo 3D interativo do sensor ultrassônico do M.O.T.I.O.N.',
  },
]

let modelViewerLoad: Promise<void> | undefined

function loadModelViewer() {
  if (customElements.get('model-viewer')) return Promise.resolve()
  if (modelViewerLoad) return modelViewerLoad
  modelViewerLoad = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js'
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => reject(new Error('O visualizador 3D não carregou.')), { once: true })
    document.head.append(script)
  })
  return modelViewerLoad
}

function TechnicalModelSection() {
  return (
    <div className="technical-models">
      <div className="technical-models-heading">
        <Eyebrow>Outras peças do protótipo</Eyebrow>
        <h3>Explore os componentes em 3D.</h3>
        <p>Arraste para girar e veja o botão tátil e o sensor de diferentes ângulos.</p>
      </div>
      <div className="technical-models-grid">
        {technicalModels.map((model, index) => (
          <TechnicalModelCard key={model.src} {...model} number={index + 1} />
        ))}
      </div>
    </div>
  )
}

function TechnicalModelCard({ title, description, src, alt, number }: {
  title: string; description: string; src: string; alt: string; number: number
}) {
  const cardRef = useRef<HTMLElement>(null)
  const [nearViewport, setNearViewport] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const node = cardRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) { setNearViewport(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect() }
    }, { rootMargin: '280px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!nearViewport) return
    let active = true
    loadModelViewer().then(() => {
      if (active) setLoaded(true)
    }).catch(() => {
      if (active) setFailed(true)
    })
    return () => { active = false }
  }, [nearViewport])

  return (
    <article ref={cardRef} className="technical-model-card">
      <div className="technical-model-copy">
        <span className="technical-model-number">{String(number).padStart(2, '0')}</span>
        <div><h4>{title}</h4><p>{description}</p></div>
      </div>
      {loaded ? createElement('model-viewer', {
        src: `${import.meta.env.BASE_URL}${src}`,
        alt,
        'camera-controls': '',
        'touch-action': 'pan-y',
        'interaction-prompt': 'auto',
        'shadow-intensity': '1',
        exposure: '1',
        'environment-image': 'neutral',
        loading: 'lazy',
        reveal: 'auto',
      }) : (
        <div className="technical-model-placeholder" role="status">
          {failed ? 'Este modelo 3D não carregou. A foto e a demonstração principal continuam disponíveis.' : 'O modelo 3D aparece quando você chegar aqui.'}
        </div>
      )}
      <div className="technical-model-hint"><span>Arraste para girar</span><span aria-hidden="true">↗</span></div>
    </article>
  )
}

function DeferredButtonGallery({ selectedColor, onSelectButton }: {
  selectedColor: ButtonColor
  onSelectButton: (color: ButtonColor) => void
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    if (!('IntersectionObserver' in window)) { setReady(true); return }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); observer.disconnect() }
    }, { rootMargin: '280px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={stageRef} className="button-gallery-lazy">
      {ready ? (
        <Suspense fallback={<div className="button-gallery-loading">Preparando os cinco botões…</div>}>
          <ButtonGallery3D selectedColor={selectedColor} onSelectButton={onSelectButton} />
        </Suspense>
      ) : (
        <div className="button-gallery-placeholder">
          <span aria-hidden="true">● ● ● ● ●</span>
          <p>Os cinco botões 3D aparecem aqui. Role até esta parte para explorá-los.</p>
          <button type="button" onClick={() => setReady(true)}>Carregar os modelos agora</button>
        </div>
      )}
    </div>
  )
}

function useFeedback() {
  const [feedback, setFeedback] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const showFeedback = useCallback((message: string) => {
    setFeedback(message)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setFeedback(''), 2600)
  }, [])
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])
  return { feedback, showFeedback }
}

function MessageIcon() {
  return <span className="message-icon" aria-hidden="true"><span /><span /><span /></span>
}

function CommunicationBoard() {
  const { phrase, addWord, removeLastWord, clearPhrase, savePhrase, speakPhrase, favorites, history } = useMotionStore()
  const [category, setCategory] = useState<BoardCategory>('necessidades')
  const { feedback, showFeedback } = useFeedback()
  const activeCards = useMemo(() => boardCards.filter((card) => card.category === category), [category])
  const currentPhrase = phrase.join(' ')

  const speak = (text: string) => {
    if (!text.trim()) { showFeedback('Escolha uma figura para montar a frase.'); return }
    if (!('speechSynthesis' in window)) {
      showFeedback('A frase está na tela, mas este navegador não tem fala automática.')
      return
    }
    speakPhrase(text)
    showFeedback('Falando em português.')
  }
  const handleSave = () => {
    if (!currentPhrase) { showFeedback('Monte uma frase antes de guardar.'); return }
    savePhrase()
    showFeedback(favorites.includes(currentPhrase) ? 'Essa frase já está nos favoritos.' : 'Frase guardada neste navegador.')
  }

  return (
    <section className="section board-section" id="quadro">
      <div className="shell">
        <div className="section-intro-row">
          <SectionHeading
            label="Quadro de comunicação"
            title="Escolher uma figura. Montar uma frase."
            text="Toque nos cartões para criar uma mensagem. Você pode ouvi-la, guardar uma frase ou voltar atrás."
          />
          <span className="section-number">03 / 05</span>
        </div>
        <div className="board-window">
          <div className="board-topbar">
            <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
            <span>M.O.T.I.O.N. <span className="board-topbar-light">/ minha comunicação</span></span>
            <span className="board-live"><span /> Prévia interativa</span>
          </div>
          <div className="board-main">
            <div className="phrase-bar">
              <div className="phrase-label-block">
                <span className="phrase-label"><MessageIcon /> Minha frase</span>
                <strong aria-live="polite">{currentPhrase || 'Toque nas figuras para começar'}</strong>
              </div>
              <div className="phrase-actions" aria-label="Ações da frase">
                <button className="icon-button" type="button" aria-label="Desfazer última figura" disabled={!phrase.length} onClick={removeLastWord}><RotateCcw size={17} /></button>
                <button className="icon-button" type="button" aria-label="Limpar frase" disabled={!phrase.length} onClick={() => { clearPhrase(); showFeedback('Frase limpa.') }}><X size={18} /></button>
                <button className="button button-coral" type="button" disabled={!phrase.length} onClick={() => speak(currentPhrase)}><Mic size={16} /> Falar</button>
              </div>
            </div>
            <div className="board-workspace">
              <aside className="board-aside">
                <div className="board-avatar" aria-hidden="true">A</div>
                <strong>Oi, Ana!</strong>
                <span>Escolha o que quer dizer.</span>
                <div className="board-aside-rule" />
                <span className="board-aside-tag"><span /> Cada escolha conta</span>
              </aside>
              <div className="board-card-area">
                <div className="category-tabs" role="tablist" aria-label="Categorias do quadro">
                  {categories.map((item) => (
                    <button
                      key={item} type="button" role="tab" aria-selected={category === item}
                      className={`category-tab${category === item ? ' active' : ''}`}
                      onClick={() => setCategory(item)}
                    >{categoryNames[item]}</button>
                  ))}
                </div>
                <div className="communication-grid" role="tabpanel" aria-label={categoryNames[category]}>
                  {activeCards.map((card, index) => (
                    <motion.button
                      layout key={card.id} type="button"
                      className={`communication-card card-${categoryClasses[card.category]}`}
                      onClick={() => { addWord(card.phrase); showFeedback(`${card.label} entrou na frase.`) }}
                      whileTap={{ scale: 0.97 }} transition={{ duration: 0.18 }}
                      aria-label={`${card.label}: ${card.phrase}`}
                    >
                      <span className="card-number">0{index + 1}</span>
                      <span className="card-emoji" aria-hidden="true">{card.emoji}</span>
                      <strong>{card.label}</strong><small>{card.phrase}</small>
                    </motion.button>
                  ))}
                </div>
                <div className="board-footer">
                  <button className="text-link" type="button" onClick={handleSave}><Star size={16} /> Guardar frase</button>
                  <span><Volume2 size={15} /> Voz do navegador · pt-BR</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="phrase-memory">
          <div className="memory-card">
            <div className="memory-heading"><span className="memory-icon favorite-icon"><Star size={16} /></span><div><strong>Frases favoritas</strong><small>Guardadas só neste navegador</small></div></div>
            {favorites.length ? (
              <div className="memory-items">{favorites.map((item) => <button key={item} type="button" onClick={() => speak(item)}>{item}<Volume2 size={14} /></button>)}</div>
            ) : <p className="memory-empty">As frases que você guardar vão aparecer aqui.</p>}
          </div>
          <div className="memory-card">
            <div className="memory-heading"><span className="memory-icon history-icon"><RotateCcw size={16} /></span><div><strong>Ouvidas por aqui</strong><small>Histórico desta prévia</small></div></div>
            {history.length ? (
              <div className="memory-items">{history.slice(0, 3).map((item) => <button key={item} type="button" onClick={() => speak(item)}>{item}<Volume2 size={14} /></button>)}</div>
            ) : <p className="memory-empty">Quando uma frase for falada, ela aparece aqui.</p>}
          </div>
        </div>
        {feedback && <div className="toast" role="status"><Check size={16} /> {feedback}</div>}
      </div>
    </section>
  )
}

const moduleIcons: Record<string, ReactNode> = {
  Comunicação: <MessageIcon />,
  Favoritos: <Star size={21} />,
  Agenda: <CalendarDays size={21} />,
  Lembretes: <Bell size={21} />,
  Histórico: <BarChart3 size={21} />,
  'Botão Hardware': <Volume2 size={21} />,
  Ajustes: <ShieldCheck size={21} />,
}

function Modules() {
  return (
    <section className="section modules-section" id="modulos">
      <div className="shell">
        <div className="section-intro-row">
          <SectionHeading
            label="O aplicativo"
            title="Pequenas ferramentas para o dia a dia."
            text="A proposta reúne comunicação, escolhas e rotina. Estas telas mostram ideias do TCC, não um aplicativo finalizado."
          />
          <span className="section-number">04 / 05</span>
        </div>
        <div className="modules-bento">
          {modules.map((item, index) => (
            <Reveal key={item.title} className={`module-card mod-${item.color}${index === 0 ? ' mod-wide' : ''}`} delay={(index % 4) * 0.045}>
              <span className="module-icon">{moduleIcons[item.title]}</span>
              <span className="module-number">0{index + 1}</span>
              <h3>{item.title}</h3><p>{item.description}</p>
              <span className="module-tag">{item.tag}</span>
            </Reveal>
          ))}
        </div>
        <p className="modules-note"><span /> Telas ilustrativas feitas para apresentar a ideia.</p>
      </div>
    </section>
  )
}

function ResearchSection() {
  return (
    <section className="section research-section" id="pesquisa">
      <div className="shell research-layout">
        <div className="research-copy">
          <SectionHeading
            label="De onde vem a ideia"
            title="A interface vem depois da escuta."
            text="O ponto de partida do TCC é cotidiano: ter como pedir, responder, escolher e participar."
          />
          <div className="research-points">
            <article><span>01 · O desafio</span><h3>Cada pessoa se comunica de um jeito.</h3><p>A paralisia cerebral pode afetar movimento, fala e coordenação. Por isso, a proposta abre caminhos diferentes para expressar necessidades, desejos e sentimentos.</p></article>
            <article><span>02 · A intenção</span><h3>Mais autonomia nas pequenas escolhas.</h3><p>O projeto aproxima a criança de responsáveis e profissionais, para que suas escolhas possam fazer parte da rotina.</p></article>
            <article><span>03 · A proposta</span><h3>Figuras no app. Um botão na mão.</h3><p>Figuras, frases personalizáveis e um acionamento físico trabalham juntos. “Estou com fome” pode começar com um toque.</p></article>
          </div>
          <p className="research-source">Conteúdo baseado na apresentação do TCC. Números da apresentação não são tratados aqui como estatísticas verificadas.</p>
        </div>
        <figure className="research-hardware">
          <div className="research-photo-wrap"><img src={`${import.meta.env.BASE_URL}hardware-real.png`} alt="Fotografia do protótipo azul do M.O.T.I.O.N., com cinco botões coloridos e seis conectores na parte da frente" /></div>
          <figcaption><span>Foto real · protótipo do TCC</span><strong>O botão físico também faz parte da conversa.</strong></figcaption>
        </figure>
      </div>
    </section>
  )
}

function RealScreens() {
  return (
    <section className="section screens-section" id="telas">
      <div className="shell">
        <div className="section-intro-row">
          <SectionHeading
            label="Duas perspectivas"
            title="A mesma criança. Dois jeitos de acompanhar."
            text="Uma prévia das telas pensadas para quem usa o quadro e para quem ajuda a organizar a rotina."
          />
          <span className="section-number">05 / 05</span>
        </div>
        <div className="screens-grid">
          <Reveal className="screen-card screen-large">
            <div className="screen-card-header"><span className="screen-chip chip-child">Modo criança</span><span className="screen-stars" aria-hidden="true">✳ ✳</span></div>
            <div className="screen-phone"><PhoneUI variant="child" /></div>
            <div className="screen-caption"><strong>Escolhas grandes, com espaço para experimentar.</strong><span>Mockup ilustrativo</span></div>
          </Reveal>
          <Reveal className="screen-card screen-small" delay={0.08}>
            <div className="screen-card-header"><span className="screen-chip chip-adult">Modo responsável</span><span className="screen-stars" aria-hidden="true">●</span></div>
            <div className="screen-phone"><PhoneUI variant="manage" /></div>
            <div className="screen-caption"><strong>Rotina e ajustes para quem acompanha.</strong><span>Mockup ilustrativo</span></div>
          </Reveal>
          <div className="screens-aside">
            <span className="aside-doodle" aria-hidden="true">↗</span>
            <p>Uma prévia para mostrar o caminho. As telas reais do aplicativo podem entrar depois.</p>
            <a className="text-link" href="#projeto-final">Sobre o TCC <ArrowRight size={15} /></a>
          </div>
        </div>
      </div>
    </section>
  )
}

function PathAndModes() {
  const { mode, setMode } = useMotionStore()
  const childMode = mode === 'child'
  return (
    <section className="section path-section" id="caminho">
      <div className="shell">
        <SectionHeading label="O caminho de uma mensagem" title="Uma escolha chega até alguém." text="O app é parte da conversa. A criança continua no centro de cada escolha." light />
        <div className="path-grid">
          {pathSteps.map((step, index) => (
            <Reveal className="path-step" key={step.number} delay={index * 0.05}>
              <span className={`path-number path-number-${index + 1}`}>{step.number}</span>
              <h3>{step.title}</h3><p>{step.text}</p>
              {index < pathSteps.length - 1 && <ChevronRight className="path-arrow" size={19} aria-hidden="true" />}
            </Reveal>
          ))}
        </div>
        <div className="mode-story">
          <div className="mode-story-copy">
            <Eyebrow light>Duas perspectivas, uma mesma conversa</Eyebrow>
            <h3>{childMode ? <>Escolher no meu <em>tempo.</em></> : <>Acompanhar sem tirar a <em>voz.</em></>}</h3>
          </div>
          <div className="mode-switch" role="group" aria-label="Alternar exemplo de modo">
            <button type="button" className={childMode ? 'active' : ''} aria-pressed={childMode} onClick={() => setMode('child')}>Criança</button>
            <button type="button" className={!childMode ? 'active' : ''} aria-pressed={!childMode} onClick={() => setMode('professional')}>Responsável</button>
          </div>
          <div className="mode-summary" aria-live="polite">
            <strong>{childMode ? 'Poucas escolhas por vez.' : 'Mais contexto para quem acompanha.'}</strong>
            <p>{childMode ? 'Cartões grandes e retorno claro a cada toque.' : 'Rotinas, lembretes e favoritos organizados com cuidado.'}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Dashboard() {
  return (
    <section className="section dashboard-section" id="historico">
      <div className="shell">
        <div className="dashboard-heading">
          <SectionHeading
            label="Uma ideia para quem acompanha"
            title="Ver a rotina pode ajudar a conversar sobre ela."
            text="Este gráfico é cenográfico: mostra como uma tela poderia organizar informações, sem representar uso real do aplicativo."
          />
          <DemoBadge>Dados de demonstração</DemoBadge>
        </div>
        <div className="dashboard-grid">
          <div className="chart-card">
            <div className="chart-top"><div><span>Exemplo de atividade</span><strong>Uma semana ilustrativa</strong></div><span className="chart-icon"><BarChart3 size={21} /></span></div>
            <div className="chart-area">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={weeklyData} margin={{ top: 14, right: 8, left: -22, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#dce7e3" strokeDasharray="3 5" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#5e7080', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: '#f3f6ee' }} contentStyle={{ border: '1px solid #dce7e3', borderRadius: 14, fontSize: 12 }} />
                  <Bar dataKey="value" name="Interações ilustrativas" fill="#2c79cf" radius={[9, 9, 4, 4]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <small className="chart-foot"><span /> Valores fictícios usados só nesta prévia</small>
          </div>
          <div className="activity-card">
            <div className="activity-heading"><div><span>Exemplo de resumo</span><strong>Coisas do dia</strong></div><Heart size={21} /></div>
            <div className="activity-list">
              <div><span className="activity-symbol activity-coral">💬</span><b>“Eu quero brincar”</b><small>Frase de exemplo</small></div>
              <div><span className="activity-symbol activity-yellow"><CalendarDays size={18} /></span><b>Rotina concluída</b><small>Exemplo de agenda</small></div>
              <div><span className="activity-symbol activity-green">☺</span><b>Como me sinto</b><small>Exemplo de registro</small></div>
            </div>
            <div className="privacy-note"><ShieldCheck size={16} /> Nada aqui vem de uma criança real.</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Project() {
  return (
    <section className="section project-section" id="projeto-final">
      <div className="shell project-grid">
        <div className="project-copy">
          <Eyebrow>O TCC</Eyebrow>
          <h2>Pesquisa, interface e um protótipo físico.</h2>
          <p className="project-lead">Como dar mais caminhos para uma criança pedir, escolher e participar?</p>
          <div className="ods-row"><span><b>ODS 3</b><small>Saúde e bem-estar</small></span><span><b>ODS 4</b><small>Educação de qualidade</small></span></div>
        </div>
        <div className="project-facts">
          <div><span>Autoria</span><strong>Julia Ribeiro Lemos<br />Julia Souza Hoffmann<br />Mateus Flórido Pena</strong></div>
          <div><span>O tema</span><strong>Comunicação alternativa e aumentativa<br />Tecnologia assistiva</strong></div>
          <div><span>Tecnologias do projeto</span><strong>React Native · Expo · PHP · MySQL · Arduino</strong></div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <a className="wordmark" href="#top" aria-label="M.O.T.I.O.N. — voltar ao início">
          <span className="wordmark-mark" aria-hidden="true"><i /><i /><i /></span><span>M.O.T.I.O.N.</span>
        </a>
        <p>Toda criança tem o que dizer.<small>Prévia de conceito · TCC ETEC de São Paulo</small></p>
        <a className="footer-top" href="#top">Voltar ao começo <ArrowUpRight size={15} /></a>
      </div>
    </footer>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <motion.div className="reading-progress" style={{ scaleX: progress, transformOrigin: '0%' }} aria-hidden="true" />
      <Header onMenu={() => setMenuOpen(true)} />
      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
      <main id="main-content">
        <Hero />
        <ProductIntro />
        <ButtonExperience />
        <CommunicationBoard />
        <RealScreens />
        <Modules />
        <PathAndModes />
        <ResearchSection />
        <Dashboard />
        <Project />
        <section className="final-cta">
          <div className="shell final-cta-card">
            <div><Eyebrow light>Um projeto sobre escuta</Eyebrow><h2>Comunicar é participar.</h2><p>Conheça o M.O.T.I.O.N. e veja como cada escolha abre uma conversa.</p></div>
            <a className="button button-light" href="#quadro">Experimentar o quadro <ArrowUpRight size={16} /></a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default App
