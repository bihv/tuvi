<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTuviStore } from '~/stores/useTuviStore'

const store = useTuviStore()
const route = useRoute()
const activeTab = useState<'astrolabe' | 'report' | 'chat'>('activeTab', () => 'astrolabe')

const isChatActive = computed(() => {
  return route.path === '/' && store.hasCurrentAstrolabe && activeTab.value === 'chat'
})

const isReportActive = computed(() => {
  return route.path === '/' && store.hasCurrentAstrolabe && activeTab.value === 'report'
})

const isContainedViewActive = computed(() => {
  return isChatActive.value || isReportActive.value
})

const isAstrolabeView = computed(() => {
  return route.path === '/' && store.hasCurrentAstrolabe
})

// Prevent page-level scroll when in contained views (chat or report) so scrolling happens exclusively inside the tab
useHead({
  bodyAttrs: {
    class: computed(() => (isContainedViewActive.value ? 'overflow-hidden' : '')),
  },
})

// Color mode handling
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

function handleNewChart() {
  store.currentAstrolabe = null
  store.selectPalace(null)
  activeTab.value = 'astrolabe'
}
</script>

<template>
  <div
    :class="[
      'bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col selection:bg-[#0071E3] selection:text-white transition-colors duration-300',
      isContainedViewActive ? 'h-screen sm:h-dvh overflow-hidden' : 'min-h-screen'
    ]"
  >
    <!-- Subtle Ambient Spotlight (Apple Dark Mode Pro Aesthetic) -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div class="absolute -top-32 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[100px]" />
    </div>

    <!-- Header Navigation (Apple Translucent Navbar - Unified Single Header) -->
    <header class="sticky top-0 z-30 w-full apple-glass-thin border-b border-black/[0.06] dark:border-white/[0.08] transition-all duration-200">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2 sm:gap-4">
        <!-- Left: Logo & Branding / Context -->
        <div class="flex items-center gap-2 sm:gap-3 min-w-0 shrink-0">
          <NuxtLink to="/" class="flex items-center gap-2 sm:gap-2.5 group apple-press shrink-0">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1D1D1F] to-[#434346] dark:from-[#2C2C2E] dark:to-[#1C1C1E] border border-black/10 dark:border-white/10 flex items-center justify-center text-white shadow-xs transition-transform duration-200">
              <UIcon name="i-heroicons-sparkles" class="w-4 h-4 text-indigo-400" />
            </div>
            <div class="flex items-baseline gap-1.5">
              <span class="text-sm font-bold tracking-tight text-[#1D1D1F] dark:text-white">
                Tử Vi AI
              </span>
              <span class="hidden sm:inline text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Studio
              </span>
            </div>
          </NuxtLink>

          <!-- Current Astrolabe Context Tag (Visible on desktop) -->
          <div
            v-if="isAstrolabeView && store.currentAstrolabe"
            class="hidden lg:flex items-center gap-1.5 pl-3 border-l border-black/[0.08] dark:border-white/[0.08] text-xs text-slate-500"
          >
            <span class="truncate max-w-[130px] font-semibold text-slate-800 dark:text-slate-200">
              {{ store.currentAstrolabe.thienBan.name }}
            </span>
            <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-medium text-slate-600 dark:text-slate-400">
              {{ store.currentAstrolabe.thienBan.gender }}
            </span>
          </div>
        </div>

        <!-- Center: Contextual View Tabs (When Astrolabe is active) -->
        <div v-if="isAstrolabeView" class="flex items-center apple-segmented py-0.5 px-0.5 sm:px-1 shrink-0">
          <!-- View 1: Lá Số -->
          <button
            type="button"
            class="apple-segmented-item flex items-center gap-1 sm:gap-1.5 py-1 px-2.5 sm:px-3 text-xs"
            :class="activeTab === 'astrolabe' ? 'apple-segmented-item-active' : ''"
            @click="activeTab = 'astrolabe'"
          >
            <UIcon name="i-heroicons-squares-2x2" class="w-3.5 h-3.5" />
            <span>Lá Số</span>
          </button>

          <!-- View 2: Báo Cáo AI -->
          <button
            type="button"
            class="apple-segmented-item flex items-center gap-1 sm:gap-1.5 py-1 px-2.5 sm:px-3 text-xs"
            :class="activeTab === 'report' ? 'apple-segmented-item-active' : ''"
            @click="activeTab = 'report'"
          >
            <UIcon name="i-heroicons-document-text" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Báo Cáo AI</span>
            <span class="sm:hidden">Báo Cáo</span>
            <span v-if="store.currentReport" class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </button>

          <!-- View 3: Trợ Lý Chat -->
          <button
            type="button"
            class="apple-segmented-item flex items-center gap-1 sm:gap-1.5 py-1 px-2.5 sm:px-3 text-xs"
            :class="activeTab === 'chat' ? 'apple-segmented-item-active' : ''"
            @click="activeTab = 'chat'"
          >
            <UIcon name="i-heroicons-chat-bubble-left-right" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Trợ Lý Chat</span>
            <span class="sm:hidden">Chat</span>
            <span
              v-if="store.currentChatMessages.length > 0"
              class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/15 font-bold"
            >
              {{ store.currentChatMessages.length }}
            </span>
          </button>
        </div>

        <!-- Center: Standard Nav Links (When no Astrolabe or on other pages) -->
        <nav v-else class="flex items-center apple-segmented">
          <NuxtLink
            to="/"
            class="apple-segmented-item"
            active-class="apple-segmented-item-active"
          >
            Lá Số
          </NuxtLink>

          <NuxtLink
            to="/history"
            class="apple-segmented-item flex items-center gap-1.5"
            active-class="apple-segmented-item-active"
          >
            <span>Danh Bạ</span>
            <span
              v-if="store.savedCount > 0"
              class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/15 font-bold"
            >
              {{ store.savedCount }}
            </span>
          </NuxtLink>
        </nav>

        <!-- Right Header Actions -->
        <div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <!-- Quick link to Danh Bạ when in Astrolabe mode -->
          <NuxtLink
            v-if="isAstrolabeView"
            to="/history"
            class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
            title="Danh bạ lá số đã lưu"
          >
            <UIcon name="i-heroicons-bookmark" class="w-3.5 h-3.5" />
            <span class="hidden md:inline">Danh Bạ</span>
            <span
              v-if="store.savedCount > 0"
              class="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/15 font-bold"
            >
              {{ store.savedCount }}
            </span>
          </NuxtLink>

          <!-- Button to trigger new chart -->
          <button
            v-if="store.hasCurrentAstrolabe"
            type="button"
            class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold text-[#0071E3] dark:text-[#2997FF] hover:bg-[#0071E3]/10 dark:hover:bg-[#2997FF]/10 apple-press transition-colors"
            title="Lập lá số mới"
            @click="handleNewChart"
          >
            <UIcon name="i-heroicons-plus" class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Lập mới</span>
          </button>

          <!-- Theme toggle -->
          <button
            type="button"
            class="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
            aria-label="Chuyển chế độ sáng/tối"
            @click="isDark = !isDark"
          >
            <UIcon :name="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Container with NuxtPage -->
    <main
      :class="[
        'flex-1 max-w-7xl w-full mx-auto',
        isContainedViewActive
          ? 'px-0 py-0 flex flex-col min-h-0 overflow-hidden'
          : 'px-4 sm:px-6 lg:px-8 py-5 sm:py-7'
      ]"
    >
      <NuxtPage />
    </main>

    <!-- Toast Notifications Root -->
    <UNotifications />
  </div>
</template>
