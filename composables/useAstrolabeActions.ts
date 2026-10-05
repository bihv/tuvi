import { ref } from 'vue'
import type { NormalizedAstrolabe } from '~/types/tuvi'
import { exportAstrolabeAsImage, shareAstrolabe } from '~/utils/exportAstrolabe'

/**
 * Composable dùng chung cho các thao tác Xuất ảnh PNG và Chia sẻ lá số Tử Vi
 */
export function useAstrolabeActions() {
  const toast = useToast()
  const isExportingImage = ref(false)

  async function exportImage(astrolabe: NormalizedAstrolabe | null | undefined) {
    if (!astrolabe) return
    try {
      isExportingImage.value = true
      await exportAstrolabeAsImage(astrolabe)
      toast.add({
        title: 'Đã xuất ảnh lá số!',
        description: `File ảnh PNG của ${astrolabe.thienBan.name} đã được tải về.`,
        icon: 'i-heroicons-arrow-down-tray',
        color: 'emerald',
      })
    } catch (err: any) {
      toast.add({
        title: 'Xuất ảnh thất bại',
        description: err?.message || 'Có lỗi xảy ra khi tạo ảnh.',
        icon: 'i-heroicons-exclamation-circle',
        color: 'red',
      })
    } finally {
      isExportingImage.value = false
    }
  }

  async function share(astrolabe: NormalizedAstrolabe | null | undefined) {
    if (!astrolabe) return
    await shareAstrolabe(astrolabe, (msg) => {
      toast.add({
        title: msg.title,
        description: msg.description,
        color: (msg.color as any) || 'indigo',
      })
    })
  }

  return {
    isExportingImage,
    exportImage,
    share,
  }
}
