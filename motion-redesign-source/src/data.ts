export type ButtonColor = 'vermelho' | 'amarelo' | 'verde' | 'azul' | 'preto'
export type BoardCategory = 'necessidades' | 'emoções' | 'pessoas' | 'ações'

export interface CommunicationCard {
  id: string
  label: string
  emoji: string
  category: BoardCategory
  phrase: string
}

export interface MotionModule {
  title: string
  description: string
  icon: string
  color: string
  tag: string
}

export const buttonDefaults: Record<ButtonColor, string> = {
  vermelho: 'Eu preciso de ajuda',
  amarelo: 'Eu quero brincar',
  verde: 'Estou com fome',
  azul: 'Quero ir ao banheiro',
  preto: 'Eu estou cansado',
}

// A ordem segue a numeração das teclas na fotografia real do protótipo.
export const buttonOrder: ButtonColor[] = ['amarelo', 'preto', 'azul', 'vermelho', 'verde']

export const boardCards: CommunicationCard[] = [
  { id: 'comer', label: 'Comer', emoji: '🍎', category: 'necessidades', phrase: 'Eu quero comer' },
  { id: 'agua', label: 'Água', emoji: '💧', category: 'necessidades', phrase: 'Eu quero água' },
  { id: 'ajuda', label: 'Ajuda', emoji: '🫶', category: 'necessidades', phrase: 'Eu preciso de ajuda' },
  { id: 'feliz', label: 'Feliz', emoji: '😊', category: 'emoções', phrase: 'Eu estou feliz' },
  { id: 'triste', label: 'Triste', emoji: '🌧️', category: 'emoções', phrase: 'Eu estou triste' },
  { id: 'cansado', label: 'Cansado', emoji: '😴', category: 'emoções', phrase: 'Eu estou cansado' },
  { id: 'mamae', label: 'Responsável', emoji: '👩', category: 'pessoas', phrase: 'Eu quero falar com meu responsável' },
  { id: 'amigo', label: 'Amigo', emoji: '🧒', category: 'pessoas', phrase: 'Eu quero brincar com meu amigo' },
  { id: 'brincar', label: 'Brincar', emoji: '🧩', category: 'ações', phrase: 'Eu quero brincar' },
  { id: 'descansar', label: 'Descansar', emoji: '🛋️', category: 'ações', phrase: 'Eu quero descansar' },
  { id: 'banheiro', label: 'Banheiro', emoji: '🚻', category: 'ações', phrase: 'Quero ir ao banheiro' },
  { id: 'ouvir', label: 'Ouvir', emoji: '🔊', category: 'ações', phrase: 'Quero ouvir a minha frase' },
]

export const modules: MotionModule[] = [
  { title: 'Comunicação', description: 'Monte frases com figuras e escolha como quer dizer.', icon: '💬', color: 'coral', tag: 'CAA' },
  { title: 'Favoritos', description: 'Deixe as frases importantes por perto.', icon: '★', color: 'yellow', tag: 'Acesso rápido' },
  { title: 'Agenda', description: 'Veja o que vem pela frente e participe das escolhas.', icon: '📅', color: 'green', tag: 'Rotina' },
  { title: 'Lembretes', description: 'Avisos simples para ajudar nas mudanças de atividade.', icon: '🔔', color: 'blue', tag: 'Dia a dia' },
  { title: 'Histórico', description: 'Uma ideia de como rever as frases usadas. Os dados são fictícios.', icon: '▥', color: 'purple', tag: 'Demonstração' },
  { title: 'Botão Hardware', description: 'Cinco botões coloridos para mais um jeito de participar.', icon: '●', color: 'coral', tag: 'Protótipo' },
  { title: 'Ajustes', description: 'Opções de voz e de acesso para cada pessoa.', icon: '⚙', color: 'slate', tag: 'Acessibilidade' },
]

export const pathSteps = [
  { number: '01', title: 'A intenção', text: 'Uma vontade, necessidade ou sentimento.' },
  { number: '02', title: 'A escolha', text: 'Um cartão ou um botão para escolher.' },
  { number: '03', title: 'A mensagem', text: 'Uma frase pronta para ser compartilhada.' },
  { number: '04', title: 'A escuta', text: 'Alguém recebe a mensagem e responde.' },
]

// Valores ilustrativos: não representam crianças nem uso real do aplicativo.
export const weeklyData = [
  { day: 'Seg', value: 42 }, { day: 'Ter', value: 58 }, { day: 'Qua', value: 49 },
  { day: 'Qui', value: 71 }, { day: 'Sex', value: 64 }, { day: 'Sáb', value: 82 },
  { day: 'Dom', value: 68 },
]
