<script setup lang="ts">
import { ref, watch } from 'vue'
import type { NormalizedAstrolabe, NormalizedPalace } from '~/types/tuvi'
import { BRANCH_GRID_COORDINATES } from '~/utils/tuvi'
import PalaceCell from './PalaceCell.vue'
import ThienBanCard from './ThienBanCard.vue'

const props = withDefaults(
  defineProps<{
    astrolabe: NormalizedAstrolabe
    selectedPalaceName?: string | null
    isSaved?: boolean
    isGeneratingReport?: boolean
  }>(),
  {
    selectedPalaceName: null,
    isSaved: false,
    isGeneratingReport: false,
  }
)

const emit = defineEmits<{
  (e: 'selectPalace', palace: NormalizedPalace): void
  (e: 'generateReport'): void
  (e: 'saveAstrolabe'): void
  (e: 'editInput'): void
}>()

// Mobile view mode: carousel only
const mobileViewMode = ref<'carousel'>('carousel')

// Carousel scroll container ref and index tracking
const carouselContainer = ref<HTMLElement | null>(null)
const carouselActiveIndex = ref(0)

function getGridStyle(branch: string) {
  const pos = BRANCH_GRID_COORDINATES[branch] || { row: 1, col: 1 }
  return {
    gridRow: `${pos.row}`,
    gridColumn: `${pos.col}`,
  }
}

function handleSelect(palace: NormalizedPalace) {
  emit('selectPalace', palace)
}

function scrollCarousel(direction: 'prev' | 'next') {
  if (!carouselContainer.value) return
  const firstChild = carouselContainer.value.firstElementChild as HTMLElement | null
  const itemWidth = firstChild ? firstChild.getBoundingClientRect().width + 12 : 320
  const currentScroll = carouselContainer.value.scrollLeft
  const targetScroll = direction === 'next'
    ? currentScroll + itemWidth
    : currentScroll - itemWidth
  carouselContainer.value.scrollTo({ left: targetScroll, behavior: 'smooth' })
}

function scrollToIndex(index: number) {
  if (!carouselContainer.value) return
  const firstChild = carouselContainer.value.firstElementChild as HTMLElement | null
  const itemWidth = firstChild ? firstChild.getBoundingClientRect().width + 12 : 320
  carouselContainer.value.scrollTo({ left: index * itemWidth, behavior: 'smooth' })
  carouselActiveIndex.value = index
}

function handleCarouselScroll() {
  if (!carouselContainer.value) return
  const scrollLeft = carouselContainer.value.scrollLeft
  const firstChild = carouselContainer.value.firstElementChild as HTMLElement | null
  const itemWidth = firstChild ? firstChild.getBoundingClientRect().width + 12 : 320
  const index = Math.round(scrollLeft / itemWidth)
  carouselActiveIndex.value = Math.max(0, Math.min(index, props.astrolabe.palaces.length - 1))
}

// Auto-scroll carousel if selected palace changes externally
watch(
  () => props.selectedPalaceName,
  (newName) => {
    if (!newName) return
    const idx = props.astrolabe.palaces.findIndex(p => p.name === newName)
    if (idx !== -1 && idx !== carouselActiveIndex.value) {
      scrollToIndex(idx)
    }
  }
)
</script>

<template>
  <div class="w-full space-y-6">
    <!-- ========================================== -->
    <!-- 1. MOBILE LAYOUT (< 1024px)               -->
    <!-- Chế độ duy nhất: Carousel đủ 12 cung     -->
    <!-- ========================================== -->
    <div class="block lg:hidden space-y-5">
      <!-- Thien Ban Card on top of Mobile -->
      <ThienBanCard
        :astrolabe="astrolabe"
        :is-saved="isSaved"
        :is-generating-report="isGeneratingReport"
        @generate-report="emit('generateReport')"
        @save-astrolabe="emit('saveAstrolabe')"
        @edit-input="emit('editInput')"
      />

      <!-- Horizontal Swipe Carousel (12 Cung) -->
      <div class="space-y-3">
        <div class="flex items-center justify-between px-1 text-xs text-slate-400">
          <span class="font-medium text-slate-600 dark:text-slate-300">
            Vuốt ngang các cung ({{ carouselActiveIndex + 1 }}/{{ astrolabe.palaces.length }})
          </span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white disabled:opacity-30 apple-press"
              :disabled="carouselActiveIndex === 0"
              aria-label="Cung trước"
              @click="scrollCarousel('prev')"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white disabled:opacity-30 apple-press"
              :disabled="carouselActiveIndex >= astrolabe.palaces.length - 1"
              aria-label="Cung kế tiếp"
              @click="scrollCarousel('next')"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref="carouselContainer"
          class="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 scrollbar-none"
          @scroll="handleCarouselScroll"
        >
          <div
            v-for="palace in astrolabe.palaces"
            :key="'carousel_' + palace.name"
            class="w-[85vw] sm:w-[320px] shrink-0 snap-center"
          >
            <PalaceCell
              :palace="palace"
              :is-selected="selectedPalaceName === palace.name"
              class="h-full shadow-md"
              @select="handleSelect"
            />
          </div>
        </div>

        <!-- Dot Indicators (Apple Style) for 12 Palaces -->
        <div class="flex items-center justify-center gap-1.5 pt-1">
          <button
            v-for="(p, idx) in astrolabe.palaces"
            :key="'dot_' + p.name"
            type="button"
            class="h-1 rounded-full transition-all duration-200 cursor-pointer p-0 border-0"
            :class="idx === carouselActiveIndex ? 'w-4 bg-indigo-500' : 'w-1 bg-slate-300 dark:bg-slate-700'"
            :aria-label="`Chuyển đến ${p.name}`"
            @click="scrollToIndex(idx)"
          />
        </div>
      </div>
    </div>

    <!-- ========================================== -->
    <!-- 2. DESKTOP LAYOUT (>= 1024px)              -->
    <!-- ========================================== -->
    <div class="hidden lg:block">
      <!-- 4x4 Modern Apple Glass Grid with center Thien Ban -->
      <div class="grid grid-cols-4 grid-rows-4 gap-3 w-full max-w-7xl mx-auto min-h-[820px]">
        <!-- 12 Outer Palace Cells -->
        <div
          v-for="palace in astrolabe.palaces"
          :key="'desktop_' + palace.name"
          :style="getGridStyle(palace.earthlyBranch)"
          class="h-full"
        >
          <PalaceCell
            :palace="palace"
            :is-selected="selectedPalaceName === palace.name"
            class="h-full"
            @select="handleSelect"
          />
        </div>

        <!-- Center 2x2: ThienBanCard -->
        <div
          class="h-full flex flex-col justify-center"
          style="grid-row: 2 / 4; grid-column: 2 / 4;"
        >
          <ThienBanCard
            :astrolabe="astrolabe"
            :is-saved="isSaved"
            :is-generating-report="isGeneratingReport"
            @generate-report="emit('generateReport')"
            @save-astrolabe="emit('saveAstrolabe')"
            @edit-input="emit('editInput')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
