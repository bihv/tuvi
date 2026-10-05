<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTuviStore } from '~/stores/useTuviStore'
import type { NormalizedAstrolabe } from '~/types/tuvi'
import { getElementBadgeClass, isMaleGender } from '~/utils/tuvi'
import { useAstrolabeActions } from '~/composables/useAstrolabeActions'

const store = useTuviStore()
const router = useRouter()
const toast = useToast()
const { exportImage, share } = useAstrolabeActions()

// Search & filter
const searchQuery = ref('')
const genderFilter = ref<'all' | 'nam' | 'nu'>('all')
const hasReportFilter = ref(false)

// Rename modal state
const isRenameModalOpen = ref(false)
const renameTargetId = ref<string>('')
const renameNewName = ref('')

// Delete single modal state
const isDeleteModalOpen = ref(false)
const deleteTargetAstrolabe = ref<NormalizedAstrolabe | null>(null)

// Delete all modal state
const isDeleteAllModalOpen = ref(false)

// Filtered list
const filteredAstrolabes = computed(() => {
  return store.savedAstrolabes.filter((item) => {
    // Search query match
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      const nameMatch = item.thienBan.name.toLowerCase().includes(q)
      const yearMatch = item.thienBan.chineseDate.year.toLowerCase().includes(q)
      const elementMatch = item.thienBan.fiveElementsClass.toLowerCase().includes(q)
      if (!nameMatch && !yearMatch && !elementMatch) {
        return false
      }
    }

    // Gender filter
    if (genderFilter.value !== 'all') {
      const isNam = isMaleGender(item.thienBan.gender)
      if (genderFilter.value === 'nam' && !isNam) return false
      if (genderFilter.value === 'nu' && isNam) return false
    }

    // Has report filter
    if (hasReportFilter.value) {
      const hasReport = Boolean(store.reports[item.id]?.trim())
      if (!hasReport) return false
    }

    return true
  })
})

// View selected astrolabe
function handleViewAstrolabe(astrolabe: NormalizedAstrolabe) {
  store.setCurrentAstrolabe(astrolabe)
  router.push('/')
  toast.add({
    title: 'Đã mở lá số',
    description: `Đang xem lá số của ${astrolabe.thienBan.name}`,
    icon: 'i-heroicons-arrow-right',
    color: 'indigo',
  })
}

// Open rename modal
function openRenameModal(astrolabe: NormalizedAstrolabe) {
  renameTargetId.value = astrolabe.id
  renameNewName.value = astrolabe.thienBan.name
  isRenameModalOpen.value = true
}

// Submit rename
function submitRename() {
  const newName = renameNewName.value.trim()
  if (!newName) {
    toast.add({
      title: 'Tên không hợp lệ',
      description: 'Vui lòng nhập tên đương số hợp lệ.',
      color: 'red',
    })
    return
  }

  store.renameSavedAstrolabe(renameTargetId.value, newName)
  isRenameModalOpen.value = false
  toast.add({
    title: 'Đã đổi tên thành công!',
    description: `Tên mới: ${newName}`,
    icon: 'i-heroicons-check',
    color: 'emerald',
  })
}

// Open delete modal
function openDeleteModal(astrolabe: NormalizedAstrolabe) {
  deleteTargetAstrolabe.value = astrolabe
  isDeleteModalOpen.value = true
}

// Confirm delete
function confirmDelete() {
  if (deleteTargetAstrolabe.value) {
    const deletedName = deleteTargetAstrolabe.value.thienBan.name
    store.removeSavedAstrolabe(deleteTargetAstrolabe.value.id)
    isDeleteModalOpen.value = false
    deleteTargetAstrolabe.value = null
    toast.add({
      title: 'Đã xóa lá số',
      description: `Đã xóa lá số của ${deletedName} khỏi danh bạ.`,
      icon: 'i-heroicons-trash',
      color: 'gray',
    })
  }
}

// Confirm delete all
function confirmDeleteAll() {
  store.clearAllData()
  isDeleteAllModalOpen.value = false
  toast.add({
    title: 'Đã xóa toàn bộ danh bạ',
    description: 'Dữ liệu lưu trữ đã được làm trống.',
    icon: 'i-heroicons-trash',
    color: 'gray',
  })
}

// Export single astrolabe image
async function handleExportItem(astrolabe: NormalizedAstrolabe) {
  await exportImage(astrolabe)
}

// Share single astrolabe
async function handleShareItem(astrolabe: NormalizedAstrolabe) {
  await share(astrolabe)
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-6">
    <!-- Top Header & Action Controls (Apple Style) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08] gap-4">
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">
            {{ store.savedCount }} lá số đã lưu
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1D1D1F] dark:text-white mt-1">
          Danh Bạ Lá Số
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Dữ liệu được lưu an toàn và bảo mật trên thiết bị của bạn.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#3FA2FF] text-white text-xs font-semibold shadow-xs apple-press transition-all"
        >
          <UIcon name="i-heroicons-plus" class="w-3.5 h-3.5" />
          <span>Lập lá số mới</span>
        </NuxtLink>
        <button
          v-if="store.savedCount > 0"
          type="button"
          class="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-500 hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
          @click="isDeleteAllModalOpen = true"
        >
          <UIcon name="i-heroicons-trash" class="w-3.5 h-3.5" />
          <span>Xóa tất cả</span>
        </button>
      </div>
    </div>

    <!-- Search & Filter Controls (Apple Segmented Bar) -->
    <div v-if="store.savedCount > 0" class="apple-card p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="flex-1 max-w-md">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Tìm theo tên, năm Can Chi, Cục..."
          size="sm"
          :ui="{
            rounded: 'rounded-xl',
            color: { white: { outline: 'shadow-none bg-[#F2F2F7] dark:bg-[#1C1C1E] ring-1 ring-black/[0.06] dark:ring-white/[0.08] focus:ring-2 focus:ring-[#0071E3]' } }
          }"
        />
      </div>

      <!-- Filter Controls -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Gender Filter Segment -->
        <div class="apple-segmented">
          <button
            type="button"
            class="apple-segmented-item text-xs py-1"
            :class="genderFilter === 'all' ? 'apple-segmented-item-active' : ''"
            @click="genderFilter === 'all'"
          >
            Tất cả
          </button>
          <button
            type="button"
            class="apple-segmented-item text-xs py-1"
            :class="genderFilter === 'nam' ? 'apple-segmented-item-active' : ''"
            @click="genderFilter === 'nam'"
          >
            Nam
          </button>
          <button
            type="button"
            class="apple-segmented-item text-xs py-1"
            :class="genderFilter === 'nu' ? 'apple-segmented-item-active' : ''"
            @click="genderFilter === 'nu'"
          >
            Nữ
          </button>
        </div>

        <!-- Has Report Filter Toggle -->
        <button
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold apple-press transition-all"
          :class="hasReportFilter ? 'bg-[#0071E3] dark:bg-[#2997FF] text-white' : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300'"
          @click="hasReportFilter = !hasReportFilter"
        >
          <UIcon name="i-heroicons-document-text" class="w-3.5 h-3.5" />
          <span>Đã có Báo Cáo</span>
        </button>
      </div>
    </div>

    <!-- Empty State: When no astrolabes saved -->
    <div
      v-if="store.savedCount === 0"
      class="apple-card p-12 text-center space-y-4 max-w-lg mx-auto shadow-md"
    >
      <div class="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/10 text-indigo-500 flex items-center justify-center mx-auto">
        <UIcon name="i-heroicons-bookmark" class="w-7 h-7" />
      </div>
      <div class="space-y-1">
        <h2 class="text-lg font-bold text-[#1D1D1F] dark:text-white">
          Chưa có lá số nào được lưu
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
          Mỗi khi bạn lập một lá số mới, hệ thống sẽ tự động lưu lại vào danh bạ này để bạn tra cứu bất kỳ lúc nào.
        </p>
      </div>
      <div class="pt-2">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0071E3] dark:bg-[#2997FF] text-white text-xs font-semibold apple-press transition-all"
        >
          <UIcon name="i-heroicons-plus" class="w-3.5 h-3.5" />
          <span>Lập lá số đầu tiên</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State: Filter produced no results -->
    <div
      v-else-if="filteredAstrolabes.length === 0"
      class="apple-card p-8 text-center space-y-3"
    >
      <UIcon name="i-heroicons-magnifying-glass" class="w-7 h-7 text-slate-400 mx-auto" />
      <p class="text-xs text-slate-500">
        Không tìm thấy lá số nào phù hợp với điều kiện tìm kiếm.
      </p>
      <button
        type="button"
        class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
        @click="searchQuery = ''; genderFilter = 'all'; hasReportFilter = false"
      >
        Xóa bộ lọc
      </button>
    </div>

    <!-- Astrolabe Cards Grid (Apple Cards) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in filteredAstrolabes"
        :key="item.id"
        class="apple-card p-5 hover:border-black/20 dark:hover:border-white/20 transition-all duration-200 flex flex-col justify-between space-y-4"
      >
        <!-- Card Top: Name, Gender & Action Buttons -->
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full" :class="isMaleGender(item.thienBan.gender) ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'">
                {{ item.thienBan.gender }}
              </span>
              <span class="text-[11px] px-2 py-0.5 rounded-full border font-semibold" :class="getElementBadgeClass(item.thienBan.fiveElementsClass)">
                {{ item.thienBan.fiveElementsClass }}
              </span>
            </div>
            <h2 class="text-lg font-bold text-[#1D1D1F] dark:text-white tracking-tight">
              {{ item.thienBan.name }}
            </h2>
            <p class="text-xs text-slate-400">
              Năm {{ item.thienBan.chineseDate.year }} • Âm lịch: {{ item.thienBan.lunarDate }} ({{ item.thienBan.timeName }})
            </p>
          </div>

          <!-- Action buttons: Export, Share, Edit, Delete (Apple Circular Buttons) -->
          <div class="flex items-center gap-0.5">
            <UTooltip text="Tải ảnh PNG">
              <button
                type="button"
                class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
                @click="handleExportItem(item)"
              >
                <UIcon name="i-heroicons-arrow-down-tray" class="w-3.5 h-3.5" />
              </button>
            </UTooltip>
            <UTooltip text="Chia sẻ lá số">
              <button
                type="button"
                class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
                @click="handleShareItem(item)"
              >
                <UIcon name="i-heroicons-share" class="w-3.5 h-3.5" />
              </button>
            </UTooltip>
            <UTooltip text="Đổi tên">
              <button
                type="button"
                class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 apple-press transition-colors"
                @click="openRenameModal(item)"
              >
                <UIcon name="i-heroicons-pencil-square" class="w-3.5 h-3.5" />
              </button>
            </UTooltip>
            <UTooltip text="Xóa khỏi danh bạ">
              <button
                type="button"
                class="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 apple-press transition-colors"
                @click="openDeleteModal(item)"
              >
                <UIcon name="i-heroicons-trash" class="w-3.5 h-3.5" />
              </button>
            </UTooltip>
          </div>
        </div>

        <!-- Middle: Key astrological specs -->
        <div class="grid grid-cols-2 gap-2 text-xs py-2 border-y border-black/[0.05] dark:border-white/[0.06]">
          <div>
            <span class="text-slate-400">Chủ Mệnh:</span>
            <span class="font-bold text-amber-500 ml-1">{{ item.thienBan.soulStar }}</span>
          </div>
          <div>
            <span class="text-slate-400">Chủ Thân:</span>
            <span class="font-bold text-emerald-500 ml-1">{{ item.thienBan.bodyStar }}</span>
          </div>
          <div>
            <span class="text-slate-400">Cung Mệnh tại:</span>
            <span class="font-medium text-[#1D1D1F] dark:text-white ml-1">{{ item.thienBan.soulPalaceBranch }}</span>
          </div>
          <div>
            <span class="text-slate-400">Cung Thân tại:</span>
            <span class="font-medium text-[#1D1D1F] dark:text-white ml-1">{{ item.thienBan.bodyPalaceBranch }}</span>
          </div>
        </div>

        <!-- Bottom: Status Badges & Open Action -->
        <div class="flex items-center justify-between gap-2 pt-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span
              v-if="store.reports[item.id]"
              class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              <UIcon name="i-heroicons-document-text" class="w-3 h-3" />
              Báo cáo AI
            </span>
            <span
              v-if="store.chatHistories[item.id]?.length"
              class="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              <UIcon name="i-heroicons-chat-bubble-bottom-center" class="w-3 h-3" />
              {{ store.chatHistories[item.id].length }} tin nhắn
            </span>
          </div>

          <button
            type="button"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] dark:bg-[#2997FF] dark:hover:bg-[#3FA2FF] text-white text-xs font-semibold shadow-xs apple-press transition-all cursor-pointer"
            @click="handleViewAstrolabe(item)"
          >
            <span>Xem Lá Số</span>
            <UIcon name="i-heroicons-arrow-right" class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Đổi tên lá số -->
    <UModal v-model="isRenameModalOpen">
      <div class="p-6 space-y-4">
        <div class="space-y-1">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">
            Đổi Tên Đương Số
          </h3>
          <p class="text-xs text-slate-500">
            Cập nhật lại tên gọi hiển thị cho lá số này trong danh bạ.
          </p>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Họ và tên mới
          </label>
          <UInput
            v-model="renameNewName"
            placeholder="Nhập tên mới..."
            autofocus
            @keyup.enter="submitRename"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            color="gray"
            variant="ghost"
            label="Hủy"
            @click="isRenameModalOpen = false"
          />
          <UButton
            color="primary"
            label="Lưu thay đổi"
            class="font-bold"
            @click="submitRename"
          />
        </div>
      </div>
    </UModal>

    <!-- Modal: Xác nhận xóa 1 lá số -->
    <UModal v-model="isDeleteModalOpen">
      <div class="p-6 space-y-4">
        <div class="flex items-center gap-3 text-red-500">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <UIcon name="i-heroicons-trash" class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Xác Nhận Xóa Lá Số
            </h3>
            <p class="text-xs text-slate-500">
              Hành động này không thể hoàn tác.
            </p>
          </div>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-300">
          Bạn có chắc chắn muốn xóa lá số của đương số
          <span class="font-bold text-slate-900 dark:text-white">{{ deleteTargetAstrolabe?.thienBan.name }}</span>
          cùng toàn bộ lịch sử luận giải AI khỏi thiết bị?
        </p>

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            color="gray"
            variant="ghost"
            label="Hủy"
            @click="isDeleteModalOpen = false"
          />
          <UButton
            color="red"
            label="Xóa lá số"
            class="font-bold"
            @click="confirmDelete"
          />
        </div>
      </div>
    </UModal>

    <!-- Modal: Xác nhận xóa tất cả -->
    <UModal v-model="isDeleteAllModalOpen">
      <div class="p-6 space-y-4">
        <div class="flex items-center gap-3 text-red-500">
          <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Xóa Toàn Bộ Danh Bạ
            </h3>
            <p class="text-xs text-slate-500">
              Cảnh báo: Dữ liệu sẽ bị xóa hoàn toàn.
            </p>
          </div>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-300">
          Bạn có chắc chắn muốn xóa toàn bộ {{ store.savedCount }} lá số đã lưu và tất cả lịch sử báo cáo, trò chuyện AI?
        </p>

        <div class="flex justify-end gap-2 pt-2">
          <UButton
            color="gray"
            variant="ghost"
            label="Hủy"
            @click="isDeleteAllModalOpen = false"
          />
          <UButton
            color="red"
            label="Xóa tất cả"
            class="font-bold"
            @click="confirmDeleteAll"
          />
        </div>
      </div>
    </UModal>
  </div>
</template>
