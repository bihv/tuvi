<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTuviStore } from '~/stores/useTuviStore'
import {
  useAstrolabeChatStream,
  useAstrolabeReportStream,
  useCalculateAstrolabeMutation,
} from '~/composables/useAstrolabe'
import type { AstrolabeInput, NormalizedAstrolabe, NormalizedPalace } from '~/types/tuvi'

// Store and composables
const store = useTuviStore()
const toast = useToast()

const calculateMutation = useCalculateAstrolabeMutation()
const reportStream = useAstrolabeReportStream()
const chatStream = useAstrolabeChatStream()

// Active view tab when astrolabe is present: 'astrolabe' | 'report' | 'chat'
const activeTab = useState<'astrolabe' | 'report' | 'chat'>('activeTab', () => 'astrolabe')

// Check if current tab is contained/fixed-height with internal scrolling
const isContainedTab = computed(() => {
  return store.hasCurrentAstrolabe && (activeTab.value === 'chat' || activeTab.value === 'report')
})

// Sheet state for palace details
const isPalaceSheetOpen = ref(false)

// Sync sheet open with store.selectedPalaceName
watch(
  () => store.selectedPalaceName,
  (newVal) => {
    if (newVal) {
      isPalaceSheetOpen.value = true
    }
  }
)

watch(isPalaceSheetOpen, (isOpen) => {
  if (!isOpen) {
    store.selectPalace(null)
  }
})

// Check if current astrolabe is saved in storage
const isCurrentSaved = computed(() => {
  if (!store.currentAstrolabe) return false
  return store.savedAstrolabes.some(item => item.id === store.currentAstrolabe?.id)
})

// Form submission handler
async function handleFormSubmit(input: AstrolabeInput) {
  try {
    await calculateMutation.mutateAsync(input)
    activeTab.value = 'astrolabe'
    toast.add({
      title: 'Lập lá số thành công!',
      description: `Đã an sao thành công cho ${input.name}.`,
      icon: 'i-heroicons-check-circle',
      color: 'emerald',
    })
  } catch (err: any) {
    toast.add({
      title: 'Lập lá số thất bại',
      description: err?.message || 'Có lỗi xảy ra trong quá trình an sao.',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    })
  }
}

// Select a palace to view details in sheet
function handleSelectPalace(palace: NormalizedPalace) {
  store.selectPalace(palace.name)
  isPalaceSheetOpen.value = true
}

// Generate 5-part AI report
async function handleGenerateReport() {
  activeTab.value = 'report'
  if (!store.currentReport && !reportStream.isGenerating.value) {
    await reportStream.generateReport()
  }
}

// Save current astrolabe explicitly
function handleSaveAstrolabe() {
  if (!store.currentAstrolabe) return
  store.saveAstrolabe()
  toast.add({
    title: 'Đã lưu vào danh bạ!',
    description: `Lá số của ${store.currentAstrolabe.thienBan.name} đã được lưu trên thiết bị.`,
    icon: 'i-heroicons-bookmark',
    color: 'indigo',
  })
}

// Reset / edit form
function handleEditInput() {
  store.currentAstrolabe = null
  store.selectPalace(null)
}

// Handle AI question from PalaceDetailSheet
async function handlePalaceAskAi(prompt: string, palaceName: string) {
  // Close the sheet
  isPalaceSheetOpen.value = false
  store.selectPalace(palaceName)
  // Switch to chat tab
  activeTab.value = 'chat'
  // Trigger chat stream
  await chatStream.sendMessage(prompt, palaceName)
}

// Send chat message in Chat tab
async function handleSendMessage(content: string) {
  await chatStream.sendMessage(content, store.selectedPalaceName || undefined)
}

// Clear chat history for current astrolabe
function handleClearChat() {
  if (store.currentAstrolabe) {
    store.clearChatHistory(store.currentAstrolabe.id)
    toast.add({
      title: 'Đã xóa lịch sử chat',
      color: 'gray',
    })
  }
}

// Load a saved astrolabe from quick list
function handleLoadSaved(astrolabe: NormalizedAstrolabe) {
  store.setCurrentAstrolabe(astrolabe)
  activeTab.value = 'astrolabe'
  toast.add({
    title: 'Đã mở lá số',
    description: `Đang xem lá số của ${astrolabe.thienBan.name}`,
    icon: 'i-heroicons-check',
    color: 'indigo',
  })
}
</script>

<template>
  <div :class="['w-full', isContainedTab ? 'flex-1 flex flex-col min-h-0 overflow-hidden' : 'space-y-8']">
    <!-- ========================================== -->
    <!-- TRẠNG THÁI 1: CHƯA CÓ LÁ SỐ (INPUT FORM)    -->
    <!-- ========================================== -->
    <section v-if="!store.hasCurrentAstrolabe" class="space-y-8 animate-fade-in">
      <!-- Apple Minimalist Hero Intro -->
      <div class="text-center max-w-2xl mx-auto space-y-3 pt-3">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-black/[0.04] dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-black/[0.06] dark:border-white/[0.08]">
          <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 text-indigo-500" />
          <span>Tử Vi Đẩu Số Hiện Đại • Cố Vấn Bằng AI</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white leading-[1.12]">
          Khám Phá Bản Mệnh.<br />
          <span class="text-slate-400 dark:text-slate-500 font-bold">Định Hướng Tương Lai.</span>
        </h1>

        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Nhập ngày giờ sinh để lập lá số Tử Vi tức thì và nhận bài luận giải chuyên sâu về sự nghiệp, tài lộc, tình cảm theo nguyên lý Đông Phương kết hợp AI.
        </p>
      </div>

      <!-- Quick access to recently saved astrolabes if any -->
      <div v-if="store.savedAstrolabes.length > 0" class="max-w-2xl mx-auto">
        <div class="apple-card p-3.5 space-y-2.5">
          <div class="flex items-center justify-between px-1">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
              Lá số gần đây ({{ store.savedAstrolabes.length }})
            </span>
            <NuxtLink to="/history" class="text-xs font-semibold text-[#0071E3] dark:text-[#2997FF] hover:underline">
              Xem tất cả →
            </NuxtLink>
          </div>

          <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              v-for="item in store.savedAstrolabes.slice(0, 4)"
              :key="item.id"
              type="button"
              class="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F2F2F7] dark:bg-[#1C1C1E] hover:bg-black/10 dark:hover:bg-white/10 text-left apple-press transition-colors"
              @click="handleLoadSaved(item)"
            >
              <div class="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/15 text-[#1D1D1F] dark:text-white flex items-center justify-center font-bold text-[11px]">
                {{ item.thienBan.name.charAt(0) }}
              </div>
              <div>
                <p class="text-xs font-bold text-[#1D1D1F] dark:text-white leading-tight">
                  {{ item.thienBan.name }}
                </p>
                <p class="text-[10px] text-slate-400">
                  {{ item.thienBan.gender }} • {{ item.thienBan.chineseDate.year }}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Birth Input Form -->
      <div class="max-w-2xl mx-auto">
        <BirthInputForm
          :is-loading="calculateMutation.isPending.value"
          @submit="handleFormSubmit"
        />
      </div>
    </section>

    <!-- ========================================== -->
    <!-- TRẠNG THÁI 2: ĐÃ CÓ LÁ SỐ (HIỂN THỊ CHI TIẾT) -->
    <!-- ========================================== -->
    <section v-else :class="['w-full', isContainedTab ? 'flex-1 flex flex-col min-h-0 overflow-hidden' : 'space-y-6']">
      <!-- VIEW 1: LÁ SỐ 12 CUNG & THIÊN BÀN -->
      <div v-show="activeTab === 'astrolabe'" class="space-y-6">
        <AstrolabeGrid
          :astrolabe="store.currentAstrolabe"
          :selected-palace-name="store.selectedPalaceName"
          :is-saved="isCurrentSaved"
          :is-generating-report="reportStream.isGenerating.value"
          @select-palace="handleSelectPalace"
          @generate-report="handleGenerateReport"
          @save-astrolabe="handleSaveAstrolabe"
          @edit-input="handleEditInput"
        />

        <!-- Palace Detail Bottom Sheet / Drawer -->
        <PalaceDetailSheet
          v-model="isPalaceSheetOpen"
          :palace="store.selectedPalace"
          :astrolabe="store.currentAstrolabe"
          @ask-ai="handlePalaceAskAi"
          @close="store.selectPalace(null)"
        />
      </div>

      <!-- VIEW 2: BÁO CÁO LUẬN GIẢI 5 MỤC BẰNG AI -->
      <div
        v-show="activeTab === 'report'"
        class="w-full flex-1 flex flex-col min-h-0 h-[calc(100dvh-3.5rem)] max-h-full overflow-hidden"
      >
        <!-- If report is not yet generated and not generating -->
        <div
          v-if="!store.currentReport && !reportStream.isGenerating.value"
          class="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
        >
          <div class="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25 shrink-0">
            <UIcon name="i-heroicons-sparkles" class="w-8 h-8" />
          </div>

          <div class="space-y-2 max-w-lg mx-auto">
            <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Báo Cáo Luận Giải 5 Trụ Cột Đời Sống
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Mô hình AI sẽ phân tích chuyên sâu lá số của <span class="font-bold text-indigo-500">{{ store.currentAstrolabe.thienBan.name }}</span> theo nguyên lý cổ truyền kết hợp trí tuệ nhân tạo và cung cấp định hướng thiết thực.
            </p>
          </div>

          <!-- 5 Topics preview -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-md w-full mx-auto text-left text-xs">
            <div class="p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">1</span>
              <span>Bản Mệnh & Tính cách cốt lõi</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">2</span>
              <span>Sự nghiệp & Cơ hội (Quan Lộc)</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">3</span>
              <span>Tài lộc & Quản lý (Tài Bạch)</span>
            </div>
            <div class="p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">4</span>
              <span>Tình duyên & Gia đạo (Phu Thê)</span>
            </div>
            <div class="sm:col-span-2 p-3 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">5</span>
              <span>Vận hạn năm {{ store.currentAstrolabe.thienBan.viewingYear }} & Lời khuyên hành động thực tế</span>
            </div>
          </div>

          <div class="pt-2">
            <UButton
              size="lg"
              color="primary"
              icon="i-heroicons-sparkles"
              :loading="reportStream.isGenerating.value"
              label="Bắt đầu Sinh Báo Cáo AI"
              class="font-bold shadow-lg shadow-indigo-500/25 px-8"
              @click="reportStream.generateReport()"
            />
          </div>
        </div>

        <!-- Render Report View -->
        <AiReportView
          v-else
          class="flex-1 h-full min-h-0 overflow-hidden"
          :report-markdown="store.currentReport"
          :is-generating="reportStream.isGenerating.value"
          :astrolabe="store.currentAstrolabe"
          :astrolabe-name="store.currentAstrolabe.thienBan.name"
          @regenerate="() => reportStream.generateReport()"
          @switch-tab="(tab) => activeTab = tab"
          @ask-ai="(question) => { activeTab = 'chat'; handleSendMessage(question); }"
        />
      </div>

      <!-- VIEW 3: TRỢ LÝ AI CHAT TỰ DO -->
      <div
        v-show="activeTab === 'chat'"
        class="w-full max-w-[1600px] mx-auto flex-1 flex flex-col min-h-0 h-[calc(100dvh-3.5rem)] max-h-full overflow-hidden"
      >
        <AiChatBox
          class="flex-1 h-full min-h-0 overflow-hidden"
          :messages="store.currentChatMessages"
          :is-streaming="chatStream.isStreaming.value"
          :target-palace-name="store.selectedPalaceName"
          :selected-palace="store.selectedPalace"
          :astrolabe="store.currentAstrolabe"
          :astrolabe-name="store.currentAstrolabe.thienBan.name"
          :viewing-year="store.currentAstrolabe.thienBan.viewingYear"
          :error-message="chatStream.chatError.value"
          @send="handleSendMessage"
          @clear="handleClearChat"
          @clear-palace-focus="store.selectPalace(null)"
          @select-palace="(name) => store.selectPalace(name)"
          @switch-tab="(tab) => activeTab = tab"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
