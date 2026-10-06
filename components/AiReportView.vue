<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { marked } from 'marked'
import { renderAiMarkdown } from '~/utils/markdown'

const props = withDefaults(
  defineProps<{
    reportMarkdown?: string
    isGenerating?: boolean
    astrolabeName?: string
  }>(),
  {
    reportMarkdown: '',
    isGenerating: false,
    astrolabeName: 'Đương số',
  }
)

const emit = defineEmits<{
  (e: 'regenerate'): void
  (e: 'switchTab', tab: 'astrolabe' | 'report' | 'chat'): void
}>()

const isCopied = ref(false)
const showScrollTop = ref(false)
const contentContainer = ref<HTMLElement | null>(null)

// Convert raw markdown to sanitized HTML
const renderedHtml = computed(() => {
  if (!props.reportMarkdown) return ''
  try {
    return renderAiMarkdown(props.reportMarkdown)
  } catch (e) {
    return `<p class="text-rose-500">Lỗi hiển thị nội dung: ${String(e)}</p>`
  }
})

// Copy markdown report to clipboard
async function copyReport() {
  if (!props.reportMarkdown) return
  try {
    await navigator.clipboard.writeText(props.reportMarkdown)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

function handleScroll() {
  if (!contentContainer.value) return
  showScrollTop.value = contentContainer.value.scrollTop > 250
}

function scrollToTop() {
  contentContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

// Auto-scroll when streaming if near bottom
watch(
  () => props.reportMarkdown,
  async () => {
    if (props.isGenerating && contentContainer.value) {
      const { scrollTop, scrollHeight, clientHeight } = contentContainer.value
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150
      if (isNearBottom) {
        await nextTick()
        contentContainer.value.scrollTop = contentContainer.value.scrollHeight
      }
    }
  }
)
</script>

<template>
  <div class="h-full flex-1 min-h-0 flex flex-col overflow-hidden relative">
    <!-- Floating Top-Right Controls (Copy, Regenerate) -->
    <div
      class="absolute top-3 right-3.5 z-20 flex items-center gap-1 bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-md px-1 py-1 rounded-full border border-black/[0.06] dark:border-white/[0.08] shadow-xs"
    >
      <!-- Copy Report -->
      <button
        type="button"
        class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors disabled:opacity-40"
        :disabled="!reportMarkdown"
        :title="isCopied ? 'Đã sao chép' : 'Sao chép toàn bộ bài luận'"
        @click="copyReport"
      >
        <UIcon :name="isCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'" class="w-3.5 h-3.5" :class="isCopied ? 'text-emerald-500' : ''" />
      </button>

      <!-- Regenerate -->
      <button
        type="button"
        class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-[#0071E3] dark:hover:text-[#2997FF] hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors disabled:opacity-40"
        :disabled="isGenerating"
        title="Tạo lại bài luận giải"
        @click="emit('regenerate')"
      >
        <UIcon v-if="isGenerating" name="i-heroicons-arrow-path" class="w-3.5 h-3.5 animate-spin" />
        <UIcon v-else name="i-heroicons-arrow-path" class="w-3.5 h-3.5" />
      </button>
    </div>

      <!-- Scrollable Content Area -->
      <div
        ref="contentContainer"
        class="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 py-4 sm:p-6 lg:p-8 space-y-4 text-xs sm:text-sm [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
        @scroll="handleScroll"
      >
        <!-- Generating state / Empty state -->
        <div v-if="!reportMarkdown && !isGenerating" class="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
          <div class="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 text-indigo-500 flex items-center justify-center mx-auto">
            <UIcon name="i-heroicons-document-text" class="w-7 h-7" />
          </div>
          <div class="space-y-1 max-w-md mx-auto">
            <h3 class="font-bold text-sm text-[#1D1D1F] dark:text-white">
              Chưa có bài luận giải
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Bấm nút bên dưới để AI phân tích 12 cung, các cách cục và tạo bài luận giải 5 mục cá nhân hóa.
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-[#0071E3] dark:bg-[#2997FF] text-white text-xs font-semibold shadow-sm apple-press transition-all cursor-pointer"
            @click="emit('regenerate')"
          >
            <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
            <span>Tạo Bài Luận Giải Ngay</span>
          </button>
        </div>

        <!-- Markdown Content / Streaming -->
        <div v-else class="space-y-4 max-w-3xl mx-auto">
          <!-- Document Intro Header (In scroll flow) -->
          <div class="space-y-1 pb-4 border-b border-black/[0.06] dark:border-white/[0.08] pr-28">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/15 flex items-center gap-1.5">
                <span v-if="isGenerating" class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <UIcon v-else name="i-heroicons-sparkles" class="w-3.5 h-3.5" />
                AI Cố Vấn Cuộc Sống
              </span>
              <span class="text-[11px] text-slate-400">
                5 Trụ Cột Đời Sống
              </span>
            </div>

            <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-[#1D1D1F] dark:text-white">
              Báo Cáo Luận Giải Toàn Diện • {{ astrolabeName }}
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Phân tích chuyên sâu Mệnh, Quan Lộc, Tài Bạch, Phu Thê và Lời khuyên hành động thực tế
            </p>
          </div>
          <!-- In-progress indicator -->
          <div
            v-if="isGenerating"
            class="flex items-center gap-2 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold sticky top-0 z-10 backdrop-blur-md"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5 animate-spin shrink-0" />
            <span>Trí tuệ nhân tạo đang phân tích các cung vị và soạn thảo báo cáo...</span>
          </div>

          <!-- Rendered Markdown Body -->
          <div
            class="ai-markdown-content max-w-none"
            v-html="renderedHtml"
          />

          <!-- Streaming cursor -->
          <span
            v-if="isGenerating"
            class="inline-block w-1.5 h-3.5 bg-[#0071E3] dark:bg-[#2997FF] ml-1 animate-pulse align-middle"
          />
        </div>
      </div>

      <!-- Floating Scroll to Top button -->
      <button
        v-if="showScrollTop"
        type="button"
        class="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 dark:bg-[#2C2C2E]/90 text-slate-700 dark:text-slate-200 border border-black/10 dark:border-white/10 shadow-lg flex items-center justify-center apple-press hover:bg-black/5 dark:hover:bg-white/10 transition-all z-20 backdrop-blur-md cursor-pointer"
        title="Lên đầu trang"
        @click="scrollToTop"
      >
        <UIcon name="i-heroicons-arrow-up" class="w-4 h-4" />
      </button>
  </div>
</template>
