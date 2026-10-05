import { defineStore } from 'pinia'
import type {
  ChatMessage,
  NormalizedAstrolabe,
  NormalizedPalace,
} from '~/types/tuvi'

export interface TuviState {
  currentAstrolabe: NormalizedAstrolabe | null
  selectedPalaceName: string | null
  savedAstrolabes: NormalizedAstrolabe[]
  chatHistories: Record<string, ChatMessage[]>
  reports: Record<string, string>
}

export const useTuviStore = defineStore('tuvi', {
  state: (): TuviState => ({
    currentAstrolabe: null,
    selectedPalaceName: null,
    savedAstrolabes: [],
    chatHistories: {},
    reports: {},
  }),

  getters: {
    hasCurrentAstrolabe: (state): boolean => Boolean(state.currentAstrolabe),

    selectedPalace: (state): NormalizedPalace | undefined => {
      if (!state.currentAstrolabe || !state.selectedPalaceName) return undefined
      return state.currentAstrolabe.palaces.find(p => p.name === state.selectedPalaceName)
    },

    currentChatMessages: (state): ChatMessage[] => {
      if (!state.currentAstrolabe?.id) return []
      return state.chatHistories[state.currentAstrolabe.id] || []
    },

    currentReport: (state): string => {
      if (!state.currentAstrolabe?.id) return ''
      return state.reports[state.currentAstrolabe.id] || ''
    },

    savedCount: (state): number => state.savedAstrolabes.length,
  },

  actions: {
    setCurrentAstrolabe(astrolabe: NormalizedAstrolabe) {
      this.currentAstrolabe = astrolabe
      this.selectedPalaceName = null
    },

    selectPalace(palaceName: string | null) {
      this.selectedPalaceName = palaceName
    },

    saveAstrolabe(astrolabe?: NormalizedAstrolabe) {
      const target = astrolabe || this.currentAstrolabe
      if (!target) return

      const existingIndex = this.savedAstrolabes.findIndex(item => item.id === target.id)
      if (existingIndex >= 0) {
        // Cập nhật lá số đã có
        this.savedAstrolabes[existingIndex] = target
      } else {
        // Thêm lá số mới vào đầu danh sách
        this.savedAstrolabes.unshift(target)
      }
    },

    removeSavedAstrolabe(id: string) {
      this.savedAstrolabes = this.savedAstrolabes.filter(item => item.id !== id)
      delete this.reports[id]
      delete this.chatHistories[id]

      if (this.currentAstrolabe?.id === id) {
        this.currentAstrolabe = this.savedAstrolabes[0] || null
        this.selectedPalaceName = null
      }
    },

    renameSavedAstrolabe(id: string, newName: string) {
      const cleanName = newName.trim()
      if (!cleanName) return

      const target = this.savedAstrolabes.find(item => item.id === id)
      if (target) {
        target.thienBan.name = cleanName
      }

      if (this.currentAstrolabe?.id === id) {
        this.currentAstrolabe.thienBan.name = cleanName
      }
    },

    setReport(astrolabeId: string, reportMarkdown: string) {
      this.reports[astrolabeId] = reportMarkdown
    },

    appendReportChunk(astrolabeId: string, chunk: string) {
      if (!this.reports[astrolabeId]) {
        this.reports[astrolabeId] = ''
      }
      this.reports[astrolabeId] += chunk
    },

    addChatMessage(
      astrolabeId: string,
      message: {
        role: 'user' | 'assistant' | 'system'
        content: string
        targetPalaceName?: string
      }
    ): ChatMessage {
      if (!this.chatHistories[astrolabeId]) {
        this.chatHistories[astrolabeId] = []
      }

      const fullMessage: ChatMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        role: message.role,
        content: message.content,
        createdAt: new Date().toISOString(),
        targetPalaceName: message.targetPalaceName,
      }

      this.chatHistories[astrolabeId].push(fullMessage)
      return fullMessage
    },

    appendChatChunk(astrolabeId: string, chunk: string) {
      const history = this.chatHistories[astrolabeId]
      if (!history || history.length === 0) return

      const lastMsg = history[history.length - 1]
      if (lastMsg && lastMsg.role === 'assistant') {
        lastMsg.content += chunk
      }
    },

    clearChatHistory(astrolabeId: string) {
      this.chatHistories[astrolabeId] = []
    },

    removeLastEmptyChatMessage(astrolabeId: string) {
      const history = this.chatHistories[astrolabeId]
      if (history && history.length > 0) {
        const lastMsg = history[history.length - 1]
        if (lastMsg && lastMsg.role === 'assistant' && !lastMsg.content.trim()) {
          history.pop()
        }
      }
    },

    clearAllData() {
      this.currentAstrolabe = null
      this.selectedPalaceName = null
      this.savedAstrolabes = []
      this.chatHistories = {}
      this.reports = {}
    },
  },

  persist: true,
})
