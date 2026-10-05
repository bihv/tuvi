<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { marked } from 'marked'
import type { ChatMessage } from '~/types/tuvi'

const props = withDefaults(
  defineProps<{
    messages: ChatMessage[]
    isStreaming?: boolean
    targetPalaceName?: string | null
    astrolabeName?: string
    viewingYear?: number
    errorMessage?: string | null
    showTabNavigation?: boolean
  }>(),
  {
    isStreaming: false,
    targetPalaceName: null,
    astrolabeName: 'Đương số',
    viewingYear: undefined,
    errorMessage: null,
    showTabNavigation: false,
  }
)

const emit = defineEmits<{
  (e: 'send', message: string): void
  (e: 'clear'): void
  (e: 'clearPalaceFocus'): void
  (e: 'switchTab', tab: 'astrolabe' | 'report' | 'chat'): void
}>()

const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)

// Auto scroll to bottom
async function scrollToBottom() {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(
  () => props.messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

// Quick prompt suggestions
const quickSuggestions = computed(() => {
  const yearText = props.viewingYear ? `năm ${props.viewingYear}` : 'năm nay'
  if (props.targetPalaceName) {
    return [
      `Cung ${props.targetPalaceName} có ý nghĩa gì đặc biệt trên lá số của tôi?`,
      `Vận trình Cung ${props.targetPalaceName} trong ${yearText} ra sao?`,
      `Lời khuyên hành động thực tế cho cung ${props.targetPalaceName}`,
    ]
  }
  return [
    `Tổng quan vận trình ${yearText} của tôi có biến động gì lớn?`,
    `Tình hình công việc và sự nghiệp trong ${yearText} thế nào?`,
    `Cách quản lý tài chính và tránh hao tài trong ${yearText}?`,
    'Tình duyên và hòa hợp gia đạo cần chú ý điều gì?',
  ]
})

function handleSend() {
  const text = inputMessage.value.trim()
  if (!text || props.isStreaming) return
  emit('send', text)
  inputMessage.value = ''
  scrollToBottom()
}

function sendSuggestion(suggestion: string) {
  if (props.isStreaming) return
  emit('send', suggestion)
  scrollToBottom()
}

function renderMessageHtml(content: string): string {
  try {
    return marked(content)
  } catch {
    return content
  }
}
</script>

<template>
  <div class="h-full flex-1 min-h-0 flex flex-col overflow-hidden relative">
    <!-- Floating Top-Right Controls (Clear Chat) -->
    <div
      v-if="messages.length > 0"
      class="absolute top-3 right-3.5 z-20 flex items-center bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-md px-1.5 py-1 rounded-full border border-black/[0.06] dark:border-white/[0.08] shadow-xs"
    >
      <!-- Clear Chat -->
      <button
        type="button"
        class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
        title="Xóa hội thoại"
        @click="emit('clear')"
      >
        <UIcon name="i-heroicons-trash" class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3.5 py-4 sm:p-5 space-y-4 text-xs sm:text-sm [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
    >
      <!-- Empty state -->
      <div v-if="messages.length === 0" class="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 text-indigo-500 flex items-center justify-center">
          <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="w-6 h-6" />
        </div>
        <div class="space-y-1 max-w-sm">
          <h4 class="font-bold text-sm text-[#1D1D1F] dark:text-white">
            Trò chuyện với Cố vấn Tử Vi
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Đặt bất kỳ câu hỏi nào về sự nghiệp, tài vận, tình cảm hay các sao trên lá số của bạn.
          </p>
        </div>

        <!-- Quick suggestion pills -->
        <div class="w-full max-w-md pt-2 space-y-1.5">
          <button
            v-for="(sug, idx) in quickSuggestions"
            :key="idx"
            type="button"
            class="w-full text-left p-3 rounded-2xl bg-[#F2F2F7] dark:bg-[#1C1C1E] hover:bg-black/10 dark:hover:bg-white/10 border border-black/[0.04] dark:border-white/[0.05] apple-press transition-all text-xs text-[#1D1D1F] dark:text-[#F5F5F7] flex items-center justify-between"
            @click="sendSuggestion(sug)"
          >
            <span class="truncate">{{ sug }}</span>
            <UIcon name="i-heroicons-arrow-up-right" class="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1.5" />
          </button>
        </div>
      </div>

      <!-- Messages list -->
      <div v-else class="space-y-4">
        <div
          v-for="msg in messages"
          :key="msg.id"
          :class="[
            'flex flex-col',
            msg.role === 'user' ? 'items-end' : 'items-start'
          ]"
        >
          <!-- Palace badge if tagged -->
          <div
            v-if="msg.targetPalaceName"
            class="text-[10px] text-indigo-500 font-semibold mb-1 px-1 flex items-center gap-1"
          >
            <UIcon name="i-heroicons-tag" class="w-3 h-3" />
            <span>Về Cung {{ msg.targetPalaceName }}</span>
          </div>

          <!-- Message Bubble (Apple iOS Bubbles) -->
          <div
            :class="[
              'max-w-[85%] sm:max-w-[78%] px-4 py-3 rounded-2xl transition-all duration-200',
              msg.role === 'user'
                ? 'bg-[#0071E3] dark:bg-[#2997FF] text-white rounded-br-sm'
                : 'bg-[#F2F2F7] dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.06] text-[#1D1D1F] dark:text-[#F5F5F7] rounded-bl-sm'
            ]"
          >
            <!-- User plain text -->
            <div v-if="msg.role === 'user'" class="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
              {{ msg.content }}
            </div>

            <!-- Assistant markdown -->
            <div
              v-else-if="msg.content"
              class="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed prose-p:my-1 prose-ul:my-1 prose-li:my-0.5"
              v-html="renderMessageHtml(msg.content)"
            />

            <!-- Typing indicator for pending assistant stream -->
            <div v-else-if="isStreaming" class="flex items-center gap-1.5 py-1 text-slate-400">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 0ms" />
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 150ms" />
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 300ms" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick chips before input if chat is active -->
    <div
      v-if="messages.length > 0 && !isStreaming"
      class="px-4 py-2 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 bg-black/[0.01] dark:bg-white/[0.02] text-[11px]"
    >
      <span class="text-slate-400 shrink-0 font-medium">Gợi ý:</span>
      <button
        v-for="(sug, idx) in quickSuggestions.slice(0, 2)"
        :key="'active_' + idx"
        type="button"
        class="shrink-0 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-slate-600 dark:text-slate-300 apple-press transition-colors truncate max-w-[220px]"
        @click="sendSuggestion(sug)"
      >
        {{ sug }}
      </button>
    </div>

    <!-- Error banner if chatError occurred -->
    <div
      v-if="errorMessage"
      class="px-4 py-2 bg-rose-500/10 border-t border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between shrink-0"
    >
      <div class="flex items-center gap-1.5 truncate">
        <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 shrink-0" />
        <span class="truncate">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Active Palace Focus Banner above input -->
    <div
      v-if="targetPalaceName"
      class="px-4 py-2 border-t border-blue-500/15 bg-blue-500/10 text-[#0071E3] dark:text-[#2997FF] text-xs shrink-0"
    >
      <div class="max-w-3xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-1.5 font-medium">
          <UIcon name="i-heroicons-tag" class="w-3.5 h-3.5" />
          <span>Đang tập trung giải đoán: <strong>Cung {{ targetPalaceName }}</strong></span>
        </div>
        <button
          type="button"
          class="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-0.5 apple-press transition-colors"
          title="Bỏ tập trung cung"
          @click="emit('clearPalaceFocus')"
        >
          <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
          <span>Bỏ tập trung</span>
        </button>
      </div>
    </div>

    <!-- Input Bar (Apple Siri / Claude Style Input) -->
    <div class="px-3 py-2.5 sm:px-4 sm:py-3.5 border-t border-black/[0.06] dark:border-white/[0.08] shrink-0 bg-[#F5F5F7]/90 dark:bg-black/90 backdrop-blur-md pb-[max(0.625rem,env(safe-area-inset-bottom))]">
      <form class="max-w-3xl mx-auto flex items-center gap-2" @submit.prevent="handleSend">
        <UInput
          v-model="inputMessage"
          placeholder="Hỏi trợ lý Tử Vi điều bạn thắc mắc..."
          size="md"
          class="flex-1"
          :disabled="isStreaming"
          :ui="{
            rounded: 'rounded-full',
            color: { white: { outline: 'shadow-xs bg-white dark:bg-[#1C1C1E] ring-1 ring-black/[0.08] dark:ring-white/[0.1] focus:ring-2 focus:ring-[#0071E3]' } }
          }"
          @keydown.enter.prevent="handleSend"
        />

        <button
          type="submit"
          :disabled="!inputMessage.trim() || isStreaming"
          class="w-9 h-9 rounded-full bg-[#0071E3] dark:bg-[#2997FF] hover:bg-[#0077ED] text-white flex items-center justify-center shrink-0 apple-press transition-all disabled:opacity-40 cursor-pointer shadow-xs"
          aria-label="Gửi tin nhắn"
        >
          <UIcon v-if="isStreaming" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-heroicons-arrow-up" class="w-4 h-4" />
        </button>
      </form>
    </div>
  </div>
</template>
