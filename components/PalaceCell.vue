<script setup lang="ts">
import { computed } from 'vue'
import type { NormalizedPalace, NormalizedStar } from '~/types/tuvi'
import { getMutagenBadgeClass } from '~/utils/tuvi'

const props = withDefaults(
  defineProps<{
    palace: NormalizedPalace
    isSelected?: boolean
    compact?: boolean
  }>(),
  {
    isSelected: false,
    compact: false,
  }
)

const emit = defineEmits<{
  (e: 'select', palace: NormalizedPalace): void
}>()

// Distinguish Auspicious and Inauspicious stars
const auspiciousStarNames = new Set([
  'Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt',
  'Lộc Tồn', 'Thiên Mã', 'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa',
  'Long Trì', 'Phượng Các', 'Tam Thai', 'Bát Tọa', 'Ân Quang', 'Thiên Quý',
  'Thiên Hỷ', 'Hỷ Thần', 'Đào Hoa', 'Hồng Loan', 'Thai Phụ', 'Phong Cáo'
])

const inauspiciousStarNames = new Set([
  'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp',
  'Hóa Kỵ', 'Thiên Hình', 'Thiên Riêu', 'Đại Hao', 'Tiểu Hao', 'Tang Môn',
  'Bạch Hổ', 'Điếu Khách', 'Quan Phù', 'Quan Phủ', 'Thiên Khốc', 'Thiên Hư',
  'Kiếp Sát', 'Cô Thần', 'Quả Tú', 'Phá Toái', 'Tử Phù', 'Bệnh Phù'
])

// Apple-style Brightness Badge
function getBrightnessBadgeClass(brightness?: string): string {
  if (!brightness) return ''
  switch (brightness) {
    case 'Miếu':
      return 'text-rose-500 dark:text-rose-400 font-bold'
    case 'Vượng':
      return 'text-amber-500 dark:text-amber-400 font-semibold'
    case 'Đắc':
      return 'text-emerald-500 dark:text-emerald-400 font-semibold'
    case 'Bình':
      return 'text-slate-400 dark:text-slate-500 font-normal'
    case 'Hãm':
      return 'text-slate-400 dark:text-slate-500 italic'
    default:
      return 'text-slate-400'
  }
}

// Check if palace is special (Mệnh, Thân, Quan, Tài, Phu)
const isCorePalace = computed(() => {
  return ['Mệnh', 'Quan Lộc', 'Tài Bạch', 'Phu Thê'].includes(props.palace.name) || props.palace.isBodyPalace
})

const goodMinors = computed(() => {
  return props.palace.minorStars.filter(s => auspiciousStarNames.has(s.name))
})

const badMinors = computed(() => {
  return props.palace.minorStars.filter(s => inauspiciousStarNames.has(s.name))
})

const otherMinors = computed(() => {
  return props.palace.minorStars.filter(
    s => !auspiciousStarNames.has(s.name) && !inauspiciousStarNames.has(s.name)
  )
})
</script>

<template>
  <div
    :class="[
      'apple-card group relative flex flex-col justify-between p-3 sm:p-3.5 select-none text-left cursor-pointer apple-press transition-all duration-200',
      isSelected
        ? 'ring-2 ring-[#0071E3] dark:ring-[#2997FF] shadow-lg shadow-blue-500/10 z-20 bg-white dark:bg-[#1C1C1E]'
        : 'hover:border-black/15 dark:hover:border-white/15'
    ]"
    @click="emit('select', palace)"
  >
    <!-- Top Bar: Palace Name + Branch + Decadal -->
    <div>
      <div class="flex items-start justify-between gap-1 pb-1.5 border-b border-black/[0.05] dark:border-white/[0.06]">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span
            :class="[
              'text-xs font-bold tracking-tight uppercase',
              isCorePalace
                ? 'text-[#0071E3] dark:text-[#2997FF]'
                : 'text-[#1D1D1F] dark:text-white'
            ]"
          >
            {{ palace.name }}
          </span>

          <span
            v-if="palace.isBodyPalace"
            class="px-1.5 py-0.2 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold border border-indigo-500/20"
          >
            THÂN
          </span>
        </div>

        <!-- Can Chi & Decadal -->
        <div class="text-right">
          <div class="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {{ palace.heavenlyStem }} {{ palace.earthlyBranch }}
          </div>
          <div class="text-[10px] text-slate-400 dark:text-slate-500">
            {{ palace.decadal.range[0] }} - {{ palace.decadal.range[1] }}
          </div>
        </div>
      </div>

      <!-- Compact view for Mini-grid -->
      <div v-if="compact" class="py-2 space-y-1">
        <div class="flex flex-wrap gap-1">
          <template v-if="palace.majorStars.length > 0">
            <span
              v-for="star in palace.majorStars.slice(0, 2)"
              :key="star.name"
              class="text-[11px] font-bold text-[#1D1D1F] dark:text-white"
            >
              {{ star.name }}
            </span>
            <span v-if="palace.majorStars.length > 2" class="text-[10px] text-slate-400 font-medium">
              +{{ palace.majorStars.length - 2 }}
            </span>
          </template>
          <span v-else class="text-[10px] text-slate-400 italic">
            Vô Chính Diệu
          </span>
        </div>

        <div class="flex items-center gap-1 flex-wrap">
          <template v-for="star in palace.majorStars" :key="'mutagen_' + star.name">
            <span
              v-if="star.mutagen"
              :class="['px-1 rounded text-[9px] font-bold border', getMutagenBadgeClass(star.mutagen)]"
            >
              {{ star.mutagen }}
            </span>
          </template>
        </div>
      </div>

      <!-- Full view: Major Stars, Minor Stars, Mutagens -->
      <div v-else class="py-2 space-y-2">
        <!-- 1. Major Stars (Chính Tinh) -->
        <div class="min-h-[36px] space-y-1">
          <div v-if="palace.majorStars.length > 0" class="flex flex-col gap-0.5">
            <div
              v-for="star in palace.majorStars"
              :key="star.name"
              class="flex items-center justify-between text-xs font-bold text-[#1D1D1F] dark:text-white"
            >
              <span class="truncate">{{ star.name }}</span>
              <div class="flex items-center gap-1 shrink-0">
                <span
                  v-if="star.brightness"
                  :class="['text-[10px]', getBrightnessBadgeClass(star.brightness)]"
                  :title="star.brightness"
                >
                  {{ star.brightness }}
                </span>
                <span
                  v-if="star.mutagen"
                  :class="['px-1 rounded text-[9px] font-bold border', getMutagenBadgeClass(star.mutagen)]"
                >
                  {{ star.mutagen }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="text-[11px] text-slate-400 italic py-1">
            Vô Chính Diệu
          </div>
        </div>

        <!-- 2. Minor Stars List (Phụ Tinh) -->
        <div class="text-[11px] space-y-1 pt-1 border-t border-black/[0.03] dark:border-white/[0.04]">
          <!-- Good stars -->
          <div v-if="goodMinors.length > 0" class="flex flex-wrap gap-1">
            <span
              v-for="star in goodMinors"
              :key="star.name"
              class="text-emerald-600 dark:text-emerald-400 font-medium"
            >
              {{ star.name }}<span v-if="star.mutagen" :class="['ml-0.5 px-0.5 rounded text-[8px] border', getMutagenBadgeClass(star.mutagen)]">{{ star.mutagen }}</span>,
            </span>
          </div>

          <!-- Bad stars -->
          <div v-if="badMinors.length > 0" class="flex flex-wrap gap-1">
            <span
              v-for="star in badMinors"
              :key="star.name"
              class="text-rose-500 dark:text-rose-400 font-medium"
            >
              {{ star.name }}<span v-if="star.mutagen" :class="['ml-0.5 px-0.5 rounded text-[8px] border', getMutagenBadgeClass(star.mutagen)]">{{ star.mutagen }}</span>,
            </span>
          </div>

          <!-- Other stars preview -->
          <div v-if="otherMinors.length > 0" class="text-slate-400 dark:text-slate-500 truncate text-[10px]">
            {{ otherMinors.map(s => s.name).slice(0, 3).join(', ') }}
            <span v-if="otherMinors.length > 3">+{{ otherMinors.length - 3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar: Tràng Sinh & Bác Sỹ -->
    <div class="pt-1.5 mt-auto border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
      <span class="truncate font-medium text-slate-600 dark:text-slate-400">
        {{ palace.changsheng12 }}
      </span>
      <span class="truncate text-slate-400 dark:text-slate-500">
        {{ palace.boshi12 }}
      </span>
    </div>
  </div>
</template>
