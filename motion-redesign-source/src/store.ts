import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { buttonDefaults, type ButtonColor } from './data'

type AppMode = 'child' | 'professional'

interface MotionState {
  mode: AppMode
  phrase: string[]
  favorites: string[]
  history: string[]
  buttonPhrases: Record<ButtonColor, string>
  setMode: (mode: AppMode) => void
  addWord: (word: string) => void
  removeLastWord: () => void
  clearPhrase: () => void
  savePhrase: () => void
  speakPhrase: (phrase?: string) => void
  setButtonPhrase: (color: ButtonColor, phrase: string) => void
}

const safeStorage = {
  getItem: (name: string): string | null => {
    try { return localStorage.getItem(name) } catch { return null }
  },
  setItem: (name: string, value: string): void => {
    try { localStorage.setItem(name, value) } catch { /* modo privado: segue em memória */ }
  },
  removeItem: (name: string): void => {
    try { localStorage.removeItem(name) } catch { /* modo privado */ }
  },
}

export const useMotionStore = create<MotionState>()(persist((set, get) => ({
  mode: 'child',
  phrase: [],
  favorites: [],
  history: [],
  buttonPhrases: buttonDefaults,
  setMode: (mode) => set({ mode }),
  addWord: (word) => set((state) => ({ phrase: [...state.phrase, word] })),
  removeLastWord: () => set((state) => ({ phrase: state.phrase.slice(0, -1) })),
  clearPhrase: () => set({ phrase: [] }),
  savePhrase: () => set((state) => {
    const value = state.phrase.join(' ')
    if (!value || state.favorites.includes(value)) return state
    return { favorites: [value, ...state.favorites].slice(0, 6) }
  }),
  speakPhrase: (phrase) => {
    const value = phrase ?? get().phrase.join(' ')
    if (!value || typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(value)
    utterance.lang = 'pt-BR'
    utterance.rate = 0.92
    window.speechSynthesis.speak(utterance)
    set((state) => ({ history: [value, ...state.history.filter((item) => item !== value)].slice(0, 8) }))
  },
  setButtonPhrase: (color, phrase) => set((state) => ({ buttonPhrases: { ...state.buttonPhrases, [color]: phrase } })),
}), {
  name: 'motion-preview-state',
  storage: createJSONStorage(() => safeStorage as Storage),
}))
