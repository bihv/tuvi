<script setup lang="ts">
import { computed } from 'vue'
import type { NormalizedAstrolabe } from '~/types/tuvi'
import { getElementBadgeClass } from '~/utils/tuvi'
import { useAstrolabeActions } from '~/composables/useAstrolabeActions'

const props = withDefaults(
  defineProps<{
    astrolabe: NormalizedAstrolabe
    isSaved?: boolean
    isGeneratingReport?: boolean
  }>(),
  {
    isSaved: false,
    isGeneratingReport: false,
  }
)

const emit = defineEmits<{
  (e: 'generateReport'): void
  (e: 'saveAstrolabe'): void
  (e: 'editInput'): void
}>()

const { exportImage, share, isExportingImage } = useAstrolabeActions()

const tb = computed(() => props.astrolabe.thienBan)

async function handleExportImage() {
  await exportImage(props.astrolabe)
}

async function handleShare() {
  await share(props.astrolabe)
}
</script>

<template>
  <div class="apple-card apple-glass relative overflow-hidden p-6 sm:p-7 transition-all duration-300">
    <!-- Subtle Apple Titanium Sheen Overlay -->
    <div class="absolute -top-32 -right-32 w-72 h-72 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

    <!-- Top bar: Header & Quick Actions -->
    <div class="relative z-10 flex items-start justify-between gap-3 pb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-400/10 px-2 py-0.5 rounded-full border border-indigo-500/15">
            Thiên Bàn • Lá Số Tử Vi
          </span>
          <span class="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Hạn {{ tb.viewingYear }}
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white">
          {{ tb.name }}
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
          <span class="font-semibold text-slate-800 dark:text-slate-200">{{ tb.gender }}</span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span>Năm {{ tb.chineseDate.year }}</span>
          <span class="text-slate-300 dark:text-slate-700">•</span>
          <span>{{ tb.zodiac }} ({{ tb.sign }})</span>
        </p>
      </div>

      <!-- Quick action pill buttons -->
      <div class="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
        <!-- Xuất ảnh -->
        <UTooltip text="Tải ảnh PNG lá số">
          <button
            type="button"
            class="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
            :disabled="isExportingImage"
            aria-label="Tải ảnh lá số"
            @click="handleExportImage"
          >
            <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
          </button>
        </UTooltip>

        <!-- Chia sẻ -->
        <UTooltip text="Chia sẻ lá số">
          <button
            type="button"
            class="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
            aria-label="Chia sẻ lá số"
            @click="handleShare"
          >
            <UIcon name="i-heroicons-share" class="w-4 h-4" />
          </button>
        </UTooltip>

        <!-- Lưu -->
        <button
          type="button"
          class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold apple-press transition-all"
          :class="isSaved ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300'"
          @click="emit('saveAstrolabe')"
        >
          <UIcon :name="isSaved ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'" class="w-3.5 h-3.5" />
          <span>{{ isSaved ? 'Đã lưu' : 'Lưu' }}</span>
        </button>

        <!-- Đổi ngày sinh -->
        <button
          type="button"
          class="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
          @click="emit('editInput')"
        >
          <UIcon name="i-heroicons-pencil-square" class="w-3.5 h-3.5" />
          <span>Đổi ngày sinh</span>
        </button>
      </div>
    </div>

    <!-- Core Specs Grid (Apple Clean Metrics) -->
    <div class="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-black/[0.06] dark:border-white/[0.08] text-xs">
      <!-- Cục & Mệnh ngũ hành -->
      <div class="space-y-1">
        <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Ngũ Hành Cục</span>
        <div class="flex items-center">
          <span :class="['px-2.5 py-0.5 rounded-full border font-semibold text-xs', getElementBadgeClass(tb.fiveElementsClass)]">
            {{ tb.fiveElementsClass }}
          </span>
        </div>
      </div>

      <!-- Cung Mệnh & Cung Thân vị trí -->
      <div class="space-y-1">
        <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mệnh & Thân</span>
        <p class="font-semibold text-[#1D1D1F] dark:text-white">
          Mệnh tại <span class="text-[#0071E3] dark:text-[#2997FF]">{{ tb.soulPalaceBranch }}</span>
          <br class="hidden sm:inline">
          <span class="text-slate-300 dark:text-slate-700 font-normal"> • </span>Thân cư <span class="text-indigo-500">{{ tb.bodyPalaceBranch }}</span>
        </p>
      </div>

      <!-- Chủ Mệnh & Chủ Thân -->
      <div class="space-y-1">
        <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Chủ Tinh</span>
        <p class="font-semibold text-[#1D1D1F] dark:text-white">
          Mệnh: <span class="text-amber-500">{{ tb.soulStar }}</span>
          <br class="hidden sm:inline">
          <span class="text-slate-300 dark:text-slate-700 font-normal"> • </span>Thân: <span class="text-emerald-500">{{ tb.bodyStar }}</span>
        </p>
      </div>

      <!-- Canh Giờ & Khung giờ -->
      <div class="space-y-1">
        <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Giờ Sinh</span>
        <p class="font-semibold text-[#1D1D1F] dark:text-white">
          {{ tb.timeName }}
          <br class="hidden sm:inline">
          <span class="text-[11px] font-normal text-slate-400">({{ tb.timeRange }})</span>
        </p>
      </div>
    </div>

    <!-- Dates Information Bar -->
    <div class="relative z-10 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-black/[0.06] dark:border-white/[0.08]">
      <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
        <UIcon name="i-heroicons-calendar-days" class="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span><strong class="font-semibold text-[#1D1D1F] dark:text-white">Dương lịch:</strong> {{ tb.solarDate }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
        <UIcon name="i-heroicons-moon" class="w-3.5 h-3.5 text-amber-500 shrink-0" />
        <span><strong class="font-semibold text-[#1D1D1F] dark:text-white">Âm lịch:</strong> {{ tb.lunarDate }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
        <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 text-purple-500 shrink-0" />
        <span><strong class="font-semibold text-[#1D1D1F] dark:text-white">Tứ Trụ:</strong> {{ tb.chineseDate.full }}</span>
      </div>
    </div>

    <!-- Patterns & Action CTA -->
    <div class="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Recognized major patterns -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-xs text-slate-400 mr-1 font-medium">Cách cục:</span>
        <template v-if="astrolabe.patterns && astrolabe.patterns.length > 0">
          <span
            v-for="pattern in astrolabe.patterns"
            :key="pattern"
            class="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-white font-semibold text-xs border border-black/[0.06] dark:border-white/[0.08]"
          >
            {{ pattern }}
          </span>
        </template>
        <span v-else class="text-xs text-slate-400 italic">
          Cách cục bình hòa
        </span>
      </div>

      <!-- AI Report Action Pill -->
      <button
        type="button"
        class="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#3FA2FF] text-white text-xs font-semibold shadow-xs apple-press transition-all cursor-pointer"
        :disabled="isGeneratingReport"
        @click="emit('generateReport')"
      >
        <UIcon v-if="isGeneratingReport" name="i-heroicons-arrow-path" class="w-3.5 h-3.5 animate-spin" />
        <UIcon v-else name="i-heroicons-sparkles" class="w-3.5 h-3.5" />
        <span>{{ isGeneratingReport ? 'Đang Sinh Báo Cáo...' : 'Luận Giải AI Toàn Diện' }}</span>
      </button>
    </div>
  </div>
</template>
