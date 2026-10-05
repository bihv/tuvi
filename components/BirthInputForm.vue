<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { AstrolabeInput, CalendarType, Gender } from '~/types/tuvi'
import { CANH_GIO_LIST } from '~/utils/tuvi'

const props = withDefaults(
  defineProps<{
    isLoading?: boolean
    initialValues?: Partial<AstrolabeInput>
  }>(),
  {
    isLoading: false,
    initialValues: () => ({}),
  }
)

const emit = defineEmits<{
  (e: 'submit', payload: AstrolabeInput): void
}>()

const now = new Date()

// Form state
const name = ref(props.initialValues?.name || '')
const gender = ref<Gender>(props.initialValues?.gender || 'nam')
const calendarType = ref<CalendarType>(props.initialValues?.calendarType || 'solar')
const year = ref<number>(props.initialValues?.year || 1995)
const month = ref<number>(props.initialValues?.month || 8)
const day = ref<number>(props.initialValues?.day || 16)
const isLeapMonth = ref<boolean>(props.initialValues?.isLeapMonth || false)
const viewingYear = ref<number>(props.initialValues?.viewingYear || now.getFullYear())

// Time input mode: 'exact' (giờ:phút) | 'canhgio' (12 Canh Giờ)
const timeMode = ref<'exact' | 'canhgio'>('exact')
const hour = ref<number>(props.initialValues?.hour ?? 8)
const minute = ref<number>(props.initialValues?.minute ?? 30)
const selectedTimeIndex = ref<number>(props.initialValues?.timeIndex ?? 2) // Giờ Dần

// Calendar options for tabs
const calendarOptions = [
  { label: 'Dương Lịch', value: 'solar', icon: 'i-heroicons-sun-20-solid' },
  { label: 'Âm Lịch', value: 'lunar', icon: 'i-heroicons-moon-20-solid' },
]

const errorMessage = ref<string>('')

// Watch calendar type to toggle leap month if needed
watch(calendarType, (newVal) => {
  if (newVal === 'solar') {
    isLeapMonth.value = false
  }
})

// Validation
function validateForm(): boolean {
  if (!name.value.trim()) {
    errorMessage.value = 'Vui lòng nhập họ và tên của đương số.'
    return false
  }
  if (!year.value || year.value < 1900 || year.value > 2100) {
    errorMessage.value = 'Năm sinh không hợp lệ (hỗ trợ từ năm 1900 đến 2100).'
    return false
  }
  if (!month.value || month.value < 1 || month.value > 12) {
    errorMessage.value = 'Tháng sinh phải từ 1 đến 12.'
    return false
  }
  if (!day.value || day.value < 1 || day.value > 31) {
    errorMessage.value = 'Ngày sinh phải từ 1 đến 31.'
    return false
  }
  if (timeMode.value === 'exact') {
    if (hour.value < 0 || hour.value > 23) {
      errorMessage.value = 'Giờ sinh phải từ 0 đến 23.'
      return false
    }
    if (minute.value < 0 || minute.value > 59) {
      errorMessage.value = 'Phút sinh phải từ 0 đến 59.'
      return false
    }
  }

  errorMessage.value = ''
  return true
}

function handleSubmit() {
  if (!validateForm()) return

  const payload: AstrolabeInput = {
    name: name.value.trim(),
    gender: gender.value,
    calendarType: calendarType.value,
    year: Number(year.value),
    month: Number(month.value),
    day: Number(day.value),
    isLeapMonth: calendarType.value === 'lunar' ? isLeapMonth.value : false,
    viewingYear: Number(viewingYear.value) || now.getFullYear(),
  }

  if (timeMode.value === 'exact') {
    payload.hour = Number(hour.value)
    payload.minute = Number(minute.value)
  } else {
    payload.timeIndex = Number(selectedTimeIndex.value)
  }

  emit('submit', payload)
}
</script>

<template>
  <div class="apple-card p-6 sm:p-8 transition-all duration-300">
    <!-- Header -->
    <div class="flex items-center justify-between pb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
      <div>
        <h2 class="text-lg font-bold tracking-tight text-[#1D1D1F] dark:text-white flex items-center gap-2">
          <UIcon name="i-heroicons-sparkles" class="w-5 h-5 text-indigo-500" />
          Thông Tin Đương Số
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Nhập ngày giờ sinh để an sao chuẩn xác và nhận phân tích AI tức thì
        </p>
      </div>
    </div>

    <!-- Form content (Apple Grouped Sections) -->
    <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
      <!-- Section 1: Thông tin cá nhân -->
      <div class="bg-[#F2F2F7] dark:bg-[#1A1A1E] rounded-2xl p-4 space-y-3 border border-black/[0.03] dark:border-white/[0.04]">
        <div class="flex items-center justify-between">
          <span class="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Đương Số & Giới Tính
          </span>

          <!-- Segmented Gender Switcher -->
          <div class="apple-segmented">
            <button
              type="button"
              class="apple-segmented-item py-1 px-3 text-xs"
              :class="gender === 'nam' ? 'apple-segmented-item-active' : ''"
              @click="gender = 'nam'"
            >
              Nam
            </button>
            <button
              type="button"
              class="apple-segmented-item py-1 px-3 text-xs"
              :class="gender === 'nu' ? 'apple-segmented-item-active' : ''"
              @click="gender = 'nu'"
            >
              Nữ
            </button>
          </div>
        </div>

        <div>
          <UInput
            v-model="name"
            placeholder="Họ và tên đương số *"
            icon="i-heroicons-user"
            size="md"
            class="w-full"
            :ui="{
              rounded: 'rounded-xl',
              color: { white: { outline: 'shadow-none bg-white dark:bg-[#252528] ring-1 ring-black/[0.08] dark:ring-white/[0.1] focus:ring-2 focus:ring-[#0071E3]' } }
            }"
          />
        </div>
      </div>

      <!-- Section 2: Ngày tháng năm sinh -->
      <div class="bg-[#F2F2F7] dark:bg-[#1A1A1E] rounded-2xl p-4 space-y-3 border border-black/[0.03] dark:border-white/[0.04]">
        <div class="flex items-center justify-between">
          <span class="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Ngày Tháng Năm Sinh
          </span>

          <!-- Segmented Calendar Switcher -->
          <div class="apple-segmented">
            <button
              type="button"
              class="apple-segmented-item py-1 text-xs"
              :class="calendarType === 'solar' ? 'apple-segmented-item-active' : ''"
              @click="calendarType = 'solar'"
            >
              Dương Lịch
            </button>
            <button
              type="button"
              class="apple-segmented-item py-1 text-xs"
              :class="calendarType === 'lunar' ? 'apple-segmented-item-active' : ''"
              @click="calendarType = 'lunar'"
            >
              Âm Lịch
            </button>
          </div>
        </div>

        <!-- Inputs Ngày / Tháng / Năm -->
        <div class="grid grid-cols-3 gap-2.5">
          <label class="flex items-center h-10 px-3 rounded-xl bg-white dark:bg-[#252528] ring-1 ring-black/[0.08] dark:ring-white/[0.1] focus-within:ring-2 focus-within:ring-[#0071E3] transition-all cursor-text shadow-none">
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 select-none mr-2">Ngày</span>
            <input
              v-model.number="day"
              type="number"
              min="1"
              max="31"
              placeholder="16"
              class="w-full bg-transparent border-0 p-0 text-sm font-semibold text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-0 placeholder:text-slate-400"
            />
          </label>

          <label class="flex items-center h-10 px-3 rounded-xl bg-white dark:bg-[#252528] ring-1 ring-black/[0.08] dark:ring-white/[0.1] focus-within:ring-2 focus-within:ring-[#0071E3] transition-all cursor-text shadow-none">
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 select-none mr-2">Tháng</span>
            <input
              v-model.number="month"
              type="number"
              min="1"
              max="12"
              placeholder="8"
              class="w-full bg-transparent border-0 p-0 text-sm font-semibold text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-0 placeholder:text-slate-400"
            />
          </label>

          <label class="flex items-center h-10 px-3 rounded-xl bg-white dark:bg-[#252528] ring-1 ring-black/[0.08] dark:ring-white/[0.1] focus-within:ring-2 focus-within:ring-[#0071E3] transition-all cursor-text shadow-none">
            <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0 select-none mr-2">Năm</span>
            <input
              v-model.number="year"
              type="number"
              min="1900"
              max="2100"
              placeholder="1995"
              class="w-full bg-transparent border-0 p-0 text-sm font-semibold text-[#1D1D1F] dark:text-white focus:outline-none focus:ring-0 placeholder:text-slate-400"
            />
          </label>
        </div>

        <!-- Option Tháng nhuận cho Âm Lịch -->
        <div v-if="calendarType === 'lunar'" class="pt-1 flex items-center gap-2">
          <UCheckbox
            v-model="isLeapMonth"
            name="leapMonth"
            label="Sinh vào tháng nhuận của năm"
            :ui="{ label: 'text-xs text-amber-600 dark:text-amber-400 font-medium' }"
          />
        </div>
      </div>

      <!-- Section 3: Giờ sinh & Năm xem hạn -->
      <div class="bg-[#F2F2F7] dark:bg-[#1A1A1E] rounded-2xl p-4 space-y-3 border border-black/[0.03] dark:border-white/[0.04]">
        <div class="flex items-center justify-between">
          <span class="block text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Thời Gian Sinh
          </span>

          <!-- Segmented Time Mode Switcher -->
          <div class="apple-segmented">
            <button
              type="button"
              class="apple-segmented-item py-1 text-xs"
              :class="timeMode === 'exact' ? 'apple-segmented-item-active' : ''"
              @click="timeMode = 'exact'"
            >
              Giờ : Phút
            </button>
            <button
              type="button"
              class="apple-segmented-item py-1 text-xs"
              :class="timeMode === 'canhgio' ? 'apple-segmented-item-active' : ''"
              @click="timeMode = 'canhgio'"
            >
              12 Canh Giờ
            </button>
          </div>
        </div>

        <!-- Mode A: Exact Hour & Minute -->
        <div v-if="timeMode === 'exact'" class="grid grid-cols-2 gap-2.5">
          <UInput
            v-model.number="hour"
            type="number"
            min="0"
            max="23"
            placeholder="Giờ"
            size="md"
            icon="i-heroicons-clock"
            :ui="{
              rounded: 'rounded-xl',
              color: { white: { outline: 'shadow-none bg-white dark:bg-[#252528] ring-1 ring-black/[0.08] dark:ring-white/[0.1] focus:ring-2 focus:ring-[#0071E3]' } }
            }"
          >
            <template #trailing>
              <span class="text-xs text-slate-400 pr-2">giờ</span>
            </template>
          </UInput>

          <UInput
            v-model.number="minute"
            type="number"
            min="0"
            max="59"
            placeholder="Phút"
            size="md"
            icon="i-heroicons-ellipsis-horizontal"
            :ui="{
              rounded: 'rounded-xl',
              color: { white: { outline: 'shadow-none bg-white dark:bg-[#252528] ring-1 ring-black/[0.08] dark:ring-white/[0.1] focus:ring-2 focus:ring-[#0071E3]' } }
            }"
          >
            <template #trailing>
              <span class="text-xs text-slate-400 pr-2">phút</span>
            </template>
          </UInput>
        </div>

        <!-- Mode B: 12 Canh Giờ Selector -->
        <div v-else>
          <USelectMenu
            v-model="selectedTimeIndex"
            :options="CANH_GIO_LIST"
            value-attribute="index"
            option-attribute="name"
            size="md"
            :ui="{
              rounded: 'rounded-xl',
              color: { white: { outline: 'shadow-none bg-white dark:bg-[#252528] ring-1 ring-black/[0.08] dark:ring-white/[0.1]' } }
            }"
          >
            <template #label>
              <span class="truncate text-xs font-semibold">
                {{ CANH_GIO_LIST.find(c => c.index === selectedTimeIndex)?.name }} — {{ CANH_GIO_LIST.find(c => c.index === selectedTimeIndex)?.timeRange }}
              </span>
            </template>
            <template #option="{ option }">
              <div class="flex items-center justify-between w-full py-1">
                <div>
                  <span class="font-medium text-xs">{{ option.name }}</span>
                  <p class="text-[11px] text-slate-400">{{ option.description }}</p>
                </div>
                <span class="text-[11px] font-semibold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full ml-2">
                  {{ option.timeRange }}
                </span>
              </div>
            </template>
          </USelectMenu>
        </div>

        <!-- Năm xem hạn -->
        <div class="pt-2 border-t border-black/[0.04] dark:border-white/[0.05] flex items-center justify-between">
          <span class="text-xs text-slate-500 dark:text-slate-400">Năm xem hạn lưu niên</span>
          <div class="w-32">
            <UInput
              v-model.number="viewingYear"
              type="number"
              min="1900"
              max="2100"
              size="sm"
              icon="i-heroicons-calendar"
              :ui="{
                rounded: 'rounded-lg',
                color: { white: { outline: 'shadow-none bg-white dark:bg-[#252528] ring-1 ring-black/[0.08] dark:ring-white/[0.1]' } }
              }"
            />
          </div>
        </div>
      </div>

      <!-- Error feedback -->
      <div v-if="errorMessage" class="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
        <UIcon name="i-heroicons-exclamation-circle" class="w-4 h-4 shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Submit Action Button (Apple Primary Button) -->
      <div class="pt-2">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 px-6 rounded-2xl bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#3FA2FF] text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 apple-press transition-all disabled:opacity-50 cursor-pointer"
        >
          <UIcon v-if="isLoading" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="i-heroicons-sparkles" class="w-4 h-4" />
          <span>{{ isLoading ? 'Đang Tính Toán Lá Số...' : 'An Sao & Lập Lá Số Ngay' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>
