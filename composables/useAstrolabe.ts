import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type {
  AiChatRequest,
  AiReportRequest,
  AstrolabeCalculateResponse,
  AstrolabeInput,
  NormalizedAstrolabe,
} from '~/types/tuvi'
import { useTuviStore } from '~/stores/useTuviStore'

/**
 * TanStack Query Mutation: Tính toán an sao lá số qua API Server
 */
export function useCalculateAstrolabeMutation() {
  const store = useTuviStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ['calculate-astrolabe'],
    mutationFn: async (input: AstrolabeInput): Promise<AstrolabeCalculateResponse> => {
      return await $fetch<AstrolabeCalculateResponse>('/api/astrolabe/calculate', {
        method: 'POST',
        body: input,
      })
    },
    onSuccess: (data) => {
      if (data?.astrolabe) {
        store.setCurrentAstrolabe(data.astrolabe)
        store.saveAstrolabe(data.astrolabe)
        queryClient.invalidateQueries({ queryKey: ['saved-astrolabes'] })
      }
    },
  })
}

/**
 * TanStack Query: Lấy và đồng bộ thông tin lá số theo ID
 */
export function useAstrolabeQuery(idRef: Ref<string | undefined> | ComputedRef<string | undefined>) {
  const store = useTuviStore()

  return useQuery({
    queryKey: computed(() => ['astrolabe', unref(idRef)]),
    queryFn: async (): Promise<NormalizedAstrolabe | null> => {
      const id = unref(idRef)
      if (!id) return null

      // Tìm trong store cục bộ trước
      const localFound = store.savedAstrolabes.find(item => item.id === id)
      if (localFound) return localFound

      if (store.currentAstrolabe?.id === id) {
        return store.currentAstrolabe
      }

      return null
    },
    enabled: computed(() => Boolean(unref(idRef))),
  })
}

/**
 * Tiện ích trích xuất thông điệp lỗi chi tiết từ HTTP Response
 */
export async function extractHttpErrorMessage(response: Response): Promise<string> {
  let errDetail = `Máy chủ phản hồi mã lỗi ${response.status}: ${response.statusText}`
  try {
    const errData = await response.json()
    if (errData?.statusMessage) errDetail = errData.statusMessage
    else if (errData?.message) errDetail = errData.message
  } catch {
    const rawText = await response.text().catch(() => '')
    if (rawText) errDetail = rawText
  }
  return errDetail
}

/**
 * Composable xử lý tạo Báo cáo Luận giải 5 mục dạng Streaming
 */
export function useAstrolabeReportStream() {
  const store = useTuviStore()
  const isGenerating = ref(false)
  const streamError = ref<string | null>(null)

  async function generateReport(targetAstrolabe?: NormalizedAstrolabe) {
    const astrolabe = targetAstrolabe || store.currentAstrolabe
    if (!astrolabe) {
      streamError.value = 'Chưa có dữ liệu lá số để tạo báo cáo.'
      return
    }

    isGenerating.value = true
    streamError.value = null
    store.setReport(astrolabe.id, '')

    try {
      const payload: AiReportRequest = { astrolabe }
      const response = await fetch('/api/ai/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok || !response.body) {
        throw new Error(await extractHttpErrorMessage(response))
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        if (chunk) {
          store.appendReportChunk(astrolabe.id, chunk)
        }
      }
    } catch (err: any) {
      streamError.value = err?.message || 'Có lỗi xảy ra trong quá trình sinh báo cáo.'
      console.error('[AI Report Stream Error]', err)
    } finally {
      isGenerating.value = false
    }
  }

  return {
    isGenerating,
    streamError,
    generateReport,
  }
}

/**
 * Composable xử lý hội thoại AI Chat dạng Streaming với ngữ cảnh lá số & cung vị
 */
export function useAstrolabeChatStream() {
  const store = useTuviStore()
  const isStreaming = ref(false)
  const chatError = ref<string | null>(null)

  async function sendMessage(content: string, targetPalaceName?: string) {
    const astrolabe = store.currentAstrolabe
    if (!astrolabe) {
      chatError.value = 'Vui lòng lập hoặc chọn một lá số trước khi trò chuyện.'
      return
    }

    if (!content.trim()) return

    isStreaming.value = true
    chatError.value = null

    // 1. Ghi nhận tin nhắn người dùng
    store.addChatMessage(astrolabe.id, {
      role: 'user',
      content: content.trim(),
      targetPalaceName: targetPalaceName || store.selectedPalaceName || undefined,
    })

    // 2. Thêm tin nhắn assistant trống để đón stream
    store.addChatMessage(astrolabe.id, {
      role: 'assistant',
      content: '',
      targetPalaceName: targetPalaceName || store.selectedPalaceName || undefined,
    })

    try {
      // Chuẩn bị toàn bộ lịch sử trò chuyện của lá số hiện tại
      const rawHistory = store.currentChatMessages
      // Bỏ tin nhắn assistant rỗng vừa tạo ở cuối khi gửi lên server
      const historyToSend = rawHistory.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const payload: AiChatRequest = {
        astrolabe,
        targetPalaceName: targetPalaceName || store.selectedPalaceName || undefined,
        messages: historyToSend,
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok || !response.body) {
        throw new Error(await extractHttpErrorMessage(response))
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        if (chunk) {
          store.appendChatChunk(astrolabe.id, chunk)
        }
      }
    } catch (err: any) {
      chatError.value = err?.message || 'Có lỗi xảy ra khi truyền tin với trợ lý AI.'
      // Dọn dẹp tin nhắn assistant rỗng nếu không nhận được chunk nào để không ghi lỗi vào LocalStorage
      store.removeLastEmptyChatMessage(astrolabe.id)
      console.error('[AI Chat Stream Error]', err)
    } finally {
      isStreaming.value = false
    }
  }

  return {
    isStreaming,
    chatError,
    sendMessage,
  }
}
