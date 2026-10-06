<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { marked } from 'marked'
import { renderAiMarkdown } from '~/utils/markdown'
import type { NormalizedAstrolabe, NormalizedPalace } from '~/types/tuvi'
import { getMutagenBadgeClass, getSurroundingPalaces } from '~/utils/tuvi'
import { useTuviStore } from '~/stores/useTuviStore'
import { useAstrolabeChatStream } from '~/composables/useAstrolabe'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    palace?: NormalizedPalace | null
    astrolabe: NormalizedAstrolabe
  }>(),
  {
    modelValue: false,
    palace: null,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'askAi', prompt: string, palaceName: string): void
}>()

const store = useTuviStore()
const chatStream = useAstrolabeChatStream()

// Active tab inside sheet: 'stars' | 'trine' | 'ai'
const activeTab = ref<'stars' | 'trine' | 'ai'>('stars')
const quickAiInput = ref('')
const sheetChatContainer = ref<HTMLElement | null>(null)

const surrounding = computed(() => {
  if (!props.palace) return null
  return getSurroundingPalaces(props.astrolabe, props.palace.name)
})

// Messages specific to this palace
const palaceMessages = computed(() => {
  if (!props.palace) return []
  return store.currentChatMessages.filter(m => m.targetPalaceName === props.palace?.name)
})

// Suggested quick prompts based on palace type
const suggestedPrompts = computed(() => {
  if (!props.palace) return []
  const name = props.palace.name
  switch (name) {
    case 'Mệnh':
      return [
        'Phân tích tính cách cốt lõi và tiềm năng lớn nhất của tôi',
        'Điểm mù tâm lý và thói quen cần khắc phục',
        'Ngành nghề nào phát huy tối đa sở trường bản mệnh?',
      ]
    case 'Quan Lộc':
      return [
        'Năm nay công việc có cơ hội thăng tiến hay biến động gì?',
        'Nên làm chuyên môn độc lập hay vị trí quản lý lãnh đạo?',
        'Lời khuyên vượt qua trở ngại trong sự nghiệp',
      ]
    case 'Tài Bạch':
      return [
        'Xu hướng kiếm tiền và khả năng tích lũy tài sản',
        'Có nên đầu tư tài chính hoặc kinh doanh trong năm nay?',
        'Cách quản lý dòng tiền để tránh hao tài thất thoát',
      ]
    case 'Phu Thê':
      return [
        'Đặc điểm tính cách của người bạn đời tương lai/hiện tại',
        'Những mâu thuẫn cần phòng tránh trong tình cảm gia đạo',
        'Thời điểm hoặc bí quyết giữ gìn hôn nhân hạnh phúc',
      ]
    case 'Thiên Di':
      return [
        'Có thuận lợi khi đi làm xa, xuất ngoại hoặc công tác?',
        'Môi trường bên ngoài đối xử và cơ hội quý nhân phù trợ',
      ]
    case 'Phúc Đức':
      return [
        'Đời sống tinh thần, nội tâm và phúc ấm tổ tiên',
        'Làm thế nào để nuôi dưỡng sự an lạc nội tâm?',
      ]
    default:
      return [
        `Phân tích ý nghĩa chi tiết các sao tọa thủ tại cung ${name}`,
        `Lời khuyên hành động thực tế cho phương diện ${name}`,
      ]
  }
})

function close() {
  emit('update:modelValue', false)
  emit('close')
}

// Send AI message directly in-sheet
async function handleSendInSheet(promptText: string) {
  if (!props.palace || !promptText.trim()) return
  await chatStream.sendMessage(promptText.trim(), props.palace.name)
  quickAiInput.value = ''
  await nextTick()
  if (sheetChatContainer.value) {
    sheetChatContainer.value.scrollTop = sheetChatContainer.value.scrollHeight
  }
}

// Pop out to full chat screen
function handlePopOutToChat(promptText?: string) {
  if (!props.palace) return
  const text = promptText || quickAiInput.value.trim() || `Luận giải chi tiết cung ${props.palace.name} cho tôi`
  emit('askAi', text, props.palace.name)
  close()
}

function renderMessageHtml(content: string): string {
  try {
    return renderAiMarkdown(content)
  } catch {
    return content
  }
}

// Close on escape key
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    close()
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (typeof window !== 'undefined') {
      if (val) {
        window.addEventListener('keydown', handleKeyDown)
      } else {
        window.removeEventListener('keydown', handleKeyDown)
      }
    }
  }
)
</script>

<template>
  <!-- Backdrop & Sheet Root -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue && palace"
        class="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-sm z-50 flex flex-col justify-end lg:justify-center lg:items-end"
        @click.self="close"
      >
        <!-- Panel Container -->
        <Transition
          enter-active-class="transform transition duration-300 ease-out"
          enter-from-class="translate-y-full lg:translate-y-0 lg:translate-x-full"
          enter-to-class="translate-y-0 lg:translate-x-0"
          leave-active-class="transform transition duration-200 ease-in"
          leave-from-class="translate-y-0 lg:translate-x-0"
          leave-to-class="translate-y-full lg:translate-y-0 lg:translate-x-full"
        >
          <div
            v-if="modelValue && palace"
            class="w-full lg:w-[520px] xl:w-[580px] h-[90vh] lg:h-full bg-[#F5F5F7]/95 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-black/[0.08] dark:border-white/[0.1] rounded-t-[32px] lg:rounded-l-[32px] lg:rounded-tr-none shadow-2xl flex flex-col overflow-hidden text-[#1D1D1F] dark:text-[#F5F5F7]"
          >
            <!-- Mobile iOS drag handle -->
            <div class="block lg:hidden pt-3 pb-1 cursor-grab" @click="close">
              <div class="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto" />
            </div>

            <!-- Header -->
            <div class="p-5 sm:p-6 border-b border-black/[0.06] dark:border-white/[0.08] flex items-start justify-between gap-3 shrink-0">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    Cung Vị Chi Tiết
                  </span>
                  <span
                    v-if="palace.isBodyPalace"
                    class="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold border border-indigo-500/20"
                  >
                    THÂN CƯ TẠI ĐÂY
                  </span>
                </div>

                <h2 class="text-2xl font-bold tracking-tight mt-1 text-[#1D1D1F] dark:text-white flex items-center gap-2">
                  Cung {{ palace.name }}
                </h2>

                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Vị trí <span class="font-semibold text-slate-800 dark:text-slate-200">{{ palace.heavenlyStem }} {{ palace.earthlyBranch }}</span>
                  • Đại vận <span class="font-semibold text-[#0071E3] dark:text-[#2997FF]">{{ palace.decadal.range[0] }} - {{ palace.decadal.range[1] }} tuổi</span>
                  • {{ palace.changsheng12 }} (Tràng sinh)
                </p>
              </div>

              <!-- Close button -->
              <button
                type="button"
                class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors shrink-0"
                aria-label="Đóng"
                @click="close"
              >
                <UIcon name="i-heroicons-x-mark" class="w-5 h-5" />
              </button>
            </div>

            <!-- Tab Navigation (Apple Segmented Bar) -->
            <div class="px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0">
              <div class="apple-segmented w-full grid grid-cols-3">
                <button
                  type="button"
                  class="apple-segmented-item flex items-center justify-center gap-1.5"
                  :class="activeTab === 'stars' ? 'apple-segmented-item-active' : ''"
                  @click="activeTab = 'stars'"
                >
                  <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5" />
                  <span>Sao Tọa Thủ</span>
                </button>

                <button
                  type="button"
                  class="apple-segmented-item flex items-center justify-center gap-1.5"
                  :class="activeTab === 'trine' ? 'apple-segmented-item-active' : ''"
                  @click="activeTab = 'trine'"
                >
                  <UIcon name="i-heroicons-arrows-pointing-in" class="w-3.5 h-3.5" />
                  <span>Tam Phương</span>
                </button>

                <button
                  type="button"
                  class="apple-segmented-item flex items-center justify-center gap-1.5"
                  :class="activeTab === 'ai' ? 'apple-segmented-item-active' : ''"
                  @click="activeTab = 'ai'"
                >
                  <UIcon name="i-heroicons-chat-bubble-left-right" class="w-3.5 h-3.5" />
                  <span>Hỏi AI</span>
                  <span
                    v-if="palaceMessages.length > 0"
                    class="px-1.5 py-0.2 rounded-full text-[9px] bg-black/10 dark:bg-white/15 font-bold"
                  >
                    {{ palaceMessages.length }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Content Area (Scrollable) -->
            <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              <!-- TAB 1: STARS -->
              <div v-if="activeTab === 'stars'" class="space-y-5">
                <!-- 1. Major Stars (Chính Tinh) -->
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Chính Tinh Tọa Thủ (14 Chính Tinh)
                  </h3>

                  <div v-if="palace.majorStars.length > 0" class="space-y-2">
                    <div
                      v-for="star in palace.majorStars"
                      :key="star.name"
                      class="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 flex items-center justify-between"
                    >
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                          {{ star.name.slice(0, 1) }}
                        </div>
                        <div>
                          <div class="font-bold text-sm text-slate-900 dark:text-white">
                            {{ star.name }}
                          </div>
                          <div class="text-xs text-slate-400">
                            Chính tinh hoàng đạo
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-2">
                        <span
                          v-if="star.brightness"
                          :class="[
                            'px-2.5 py-1 rounded-lg text-xs font-semibold border',
                            star.brightness === 'Miếu' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                            star.brightness === 'Vượng' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                            star.brightness === 'Đắc' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                            'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          ]"
                        >
                          {{ star.brightness }}
                        </span>

                        <span
                          v-if="star.mutagen"
                          :class="['px-2.5 py-1 rounded-lg text-xs font-bold border', getMutagenBadgeClass(star.mutagen)]"
                        >
                          Hóa {{ star.mutagen }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div v-else class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                    <p class="font-semibold">Cung Vô Chính Diệu</p>
                    <p class="mt-0.5">Không có chính tinh đóng tại cung này. Cần mượn chính tinh từ cung xung chiếu để phân tích.</p>
                  </div>
                </div>

                <!-- 2. Minor Stars (Phụ Tinh) -->
                <div>
                  <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                    Phụ Tinh Tọa Thủ (Cát Tinh, Sát Tinh & Bàng Tinh)
                  </h3>

                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="star in palace.minorStars"
                      :key="star.name"
                      class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
                    >
                      <span>{{ star.name }}</span>
                      <span
                        v-if="star.mutagen"
                        :class="['px-1.5 py-0.2 rounded text-[10px] font-bold border', getMutagenBadgeClass(star.mutagen)]"
                      >
                        {{ star.mutagen }}
                      </span>
                    </div>

                    <div
                      v-for="star in palace.adjectiveStars"
                      :key="star.name"
                      class="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-400 text-[11px]"
                    >
                      {{ star.name }}
                    </div>
                  </div>
                </div>

                <!-- 3. Astrological Circles -->
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Vòng Tràng Sinh:</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-200">{{ palace.changsheng12 }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Vòng Bác Sỹ:</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-200">{{ palace.boshi12 }}</span>
                  </div>
                  <div v-if="palace.suiqian12" class="flex items-center justify-between">
                    <span class="text-slate-400">Vòng Tuế Tiền:</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-200">{{ palace.suiqian12 }}</span>
                  </div>
                </div>
              </div>

              <!-- TAB 2: TRINE (TAM PHƯƠNG TỨ CHÍNH) -->
              <div v-else-if="activeTab === 'trine'" class="space-y-4">
                <div class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Các cung có ảnh hưởng trực tiếp đến <strong>Cung {{ palace.name }}</strong> theo nguyên lý Tam Phương Tứ Chính:
                </div>

                <div v-if="surrounding" class="space-y-3">
                  <!-- Cung Xung Chiếu -->
                  <div class="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                        <UIcon name="i-heroicons-arrow-path-rounded-square" class="w-4 h-4" />
                        Cung Xung Chiếu (Đối diện)
                      </span>
                      <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {{ surrounding.opposite.name }} ({{ surrounding.opposite.earthlyBranch }})
                      </span>
                    </div>
                    <div class="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Chính tinh:</strong>
                      <span v-if="surrounding.opposite.majorStars.length > 0">
                        {{ surrounding.opposite.majorStars.map(s => s.name + (s.brightness ? ` (${s.brightness})` : '')).join(', ') }}
                      </span>
                      <span v-else class="text-slate-400 italic"> Vô Chính Diệu</span>
                    </div>
                  </div>

                  <!-- Cung Tam Hợp 1 -->
                  <div class="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                        Cung Tam Hợp 1
                      </span>
                      <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {{ surrounding.wealth.name }} ({{ surrounding.wealth.earthlyBranch }})
                      </span>
                    </div>
                    <div class="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Chính tinh:</strong>
                      <span v-if="surrounding.wealth.majorStars.length > 0">
                        {{ surrounding.wealth.majorStars.map(s => s.name + (s.brightness ? ` (${s.brightness})` : '')).join(', ') }}
                      </span>
                      <span v-else class="text-slate-400 italic"> Vô Chính Diệu</span>
                    </div>
                  </div>

                  <!-- Cung Tam Hợp 2 -->
                  <div class="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-1.5">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <UIcon name="i-heroicons-shield-check" class="w-4 h-4" />
                        Cung Tam Hợp 2
                      </span>
                      <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {{ surrounding.career.name }} ({{ surrounding.career.earthlyBranch }})
                      </span>
                    </div>
                    <div class="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Chính tinh:</strong>
                      <span v-if="surrounding.career.majorStars.length > 0">
                        {{ surrounding.career.majorStars.map(s => s.name + (s.brightness ? ` (${s.brightness})` : '')).join(', ') }}
                      </span>
                      <span v-else class="text-slate-400 italic"> Vô Chính Diệu</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TAB 3: ASK AI ABOUT THIS PALACE (IN-SHEET CHAT) -->
              <div v-else-if="activeTab === 'ai'" class="space-y-4">
                <div class="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <UIcon name="i-heroicons-sparkles" class="w-4 h-4" />
                    </div>
                    <div>
                      <h4 class="font-bold text-xs text-slate-900 dark:text-white">
                        Hội Thoại AI Cung {{ palace.name }}
                      </h4>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400">
                        Trò chuyện trực tiếp hoặc chuyển sang màn hình lớn
                      </p>
                    </div>
                  </div>

                  <UButton
                    size="2xs"
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-arrow-top-right-on-square"
                    title="Mở trong màn hình Chat chính"
                    @click="handlePopOutToChat()"
                  />
                </div>

                <!-- Existing messages for this palace inside sheet -->
                <div
                  v-if="palaceMessages.length > 0"
                  ref="sheetChatContainer"
                  class="space-y-3 max-h-[300px] overflow-y-auto p-2 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5"
                >
                  <div
                    v-for="msg in palaceMessages"
                    :key="msg.id"
                    :class="[
                      'flex flex-col text-xs',
                      msg.role === 'user' ? 'items-end' : 'items-start'
                    ]"
                  >
                    <div
                      :class="[
                        'max-w-[90%] px-3.5 py-2.5 rounded-2xl',
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-xs'
                          : 'bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-white/10 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                      ]"
                    >
                      <div v-if="msg.role === 'user'" class="whitespace-pre-wrap">
                        {{ msg.content }}
                      </div>
                      <div
                        v-else-if="msg.content"
                        class="ai-markdown-content max-w-none text-xs leading-relaxed"
                        v-html="renderMessageHtml(msg.content)"
                      />
                      <div v-else-if="chatStream.isStreaming.value" class="flex items-center gap-1 py-1 text-slate-400">
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 150ms" />
                        <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style="animation-delay: 300ms" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Suggested prompts list -->
                <div class="space-y-2">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Câu hỏi gợi ý nhanh:
                  </label>

                  <div class="space-y-1.5">
                    <button
                      v-for="(prompt, idx) in suggestedPrompts"
                      :key="idx"
                      type="button"
                      class="w-full text-left p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/15 border border-slate-200/60 dark:border-white/5 hover:border-indigo-500/30 transition-all text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between group"
                      @click="handleSendInSheet(prompt)"
                    >
                      <span class="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {{ prompt }}
                      </span>
                      <UIcon name="i-heroicons-paper-airplane" class="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0 ml-2" />
                    </button>
                  </div>
                </div>

                <!-- In-Sheet input form -->
                <div class="pt-2 space-y-2">
                  <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Nhập câu hỏi cho cung này:
                  </label>
                  <form class="flex items-center gap-2" @submit.prevent="handleSendInSheet(quickAiInput)">
                    <UInput
                      v-model="quickAiInput"
                      placeholder="Hỏi AI về cung vị này..."
                      size="md"
                      class="flex-1"
                      :disabled="chatStream.isStreaming.value"
                      :ui="{ rounded: 'rounded-xl' }"
                    />
                    <UButton
                      type="submit"
                      color="primary"
                      icon="i-heroicons-paper-airplane"
                      class="rounded-xl px-4 py-2"
                      :loading="chatStream.isStreaming.value"
                      :disabled="!quickAiInput.trim() || chatStream.isStreaming.value"
                    />
                  </form>
                </div>
              </div>
            </div>

            <!-- Footer / Action bar -->
            <div class="p-4 sm:p-5 border-t border-slate-200/60 dark:border-white/10 shrink-0 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/5">
              <span class="text-xs text-slate-400 truncate">
                Lá số của {{ astrolabe.thienBan.name }}
              </span>

              <div class="flex items-center gap-2">
                <UButton
                  size="sm"
                  color="gray"
                  variant="ghost"
                  label="Đóng"
                  class="rounded-xl text-xs"
                  @click="close"
                />
                <UButton
                  size="sm"
                  color="primary"
                  variant="soft"
                  icon="i-heroicons-chat-bubble-left-right"
                  class="rounded-xl font-medium text-xs"
                  @click="handlePopOutToChat()"
                >
                  Mở Toàn Bộ Chat
                </UButton>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
