import type { NormalizedAstrolabe } from '~/types/tuvi'
import { BRANCH_GRID_COORDINATES } from './tuvi'

/**
 * Vẽ lá số Tử Vi lên HTML5 Canvas với độ phân giải cao và lưu file PNG
 */
export async function exportAstrolabeAsImage(astrolabe: NormalizedAstrolabe): Promise<void> {
  if (typeof window === 'undefined') return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Kích thước chuẩn HD
  const width = 1400
  const height = 1400
  canvas.width = width
  canvas.height = height

  // 1. Nền canvas phong cách Apple Dark Minimalist
  const bgGrad = ctx.createLinearGradient(0, 0, width, height)
  bgGrad.addColorStop(0, '#0c121e')
  bgGrad.addColorStop(0.5, '#0f172a')
  bgGrad.addColorStop(1, '#090d16')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // 2. Viền ngoài bo góc nhẹ
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
  ctx.lineWidth = 2
  ctx.strokeRect(30, 30, width - 60, height - 60)

  // 3. Tọa độ 4x4 Grid truyền thống
  // 12 ô ngoài cùng, trung tâm 2x2 là Thiên Bàn
  const margin = 40
  const cellW = (width - margin * 2) / 4
  const cellH = (height - margin * 2) / 4

  // 4. Vẽ 12 Cung
  for (const palace of astrolabe.palaces) {
    const coord = BRANCH_GRID_COORDINATES[palace.earthlyBranch] || { row: 1, col: 1 }
    const pos = { col: coord.col - 1, row: coord.row - 1 }
    const x = margin + pos.col * cellW
    const y = margin + pos.row * cellH

    // Cell background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.fillRect(x + 4, y + 4, cellW - 8, cellH - 8)

    // Cell border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1
    ctx.strokeRect(x + 4, y + 4, cellW - 8, cellH - 8)

    // Tên cung & Chi
    ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = palace.name === 'Mệnh' || palace.isBodyPalace ? '#818cf8' : '#e2e8f0'
    ctx.fillText(`${palace.name}`, x + 16, y + 36)

    if (palace.isBodyPalace) {
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#c084fc'
      ctx.fillText('[THÂN]', x + 90, y + 34)
    }

    // Can Chi & Decadal
    ctx.font = '14px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#94a3b8'
    const rightText = `${palace.heavenlyStem} ${palace.earthlyBranch} (${palace.decadal.range[0]}-${palace.decadal.range[1]})`
    const rightTextW = ctx.measureText(rightText).width
    ctx.fillText(rightText, x + cellW - rightTextW - 16, y + 36)

    // Phân cách header ô
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)'
    ctx.beginPath()
    ctx.moveTo(x + 12, y + 48)
    ctx.lineTo(x + cellW - 12, y + 48)
    ctx.stroke()

    // Danh sách Chính tinh
    let starY = y + 74
    if (palace.majorStars.length === 0) {
      ctx.font = 'italic 14px system-ui, -apple-system, sans-serif'
      ctx.fillStyle = '#64748b'
      ctx.fillText('Vô Chính Diệu', x + 16, starY)
      starY += 24
    } else {
      for (const s of palace.majorStars) {
        ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.fillText(s.name, x + 16, starY)

        let starMetaX = x + 16 + ctx.measureText(s.name).width + 8
        if (s.brightness) {
          ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
          ctx.fillStyle = s.brightness === 'Miếu' ? '#f43f5e' : s.brightness === 'Vượng' ? '#f59e0b' : '#10b981'
          ctx.fillText(`(${s.brightness})`, starMetaX, starY)
          starMetaX += ctx.measureText(`(${s.brightness})`).width + 6
        }

        if (s.mutagen) {
          ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
          ctx.fillStyle = '#a855f7'
          ctx.fillText(`[Hóa ${s.mutagen}]`, starMetaX, starY)
        }

        starY += 24
      }
    }

    // Danh sách Phụ tinh nổi bật
    starY = Math.max(starY, y + 145)
    ctx.font = '13px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#38bdf8'
    const minorNames = palace.minorStars.slice(0, 5).map(s => s.name + (s.mutagen ? ` [${s.mutagen}]` : '')).join(', ')
    if (minorNames) {
      ctx.fillText(minorNames, x + 16, starY, cellW - 32)
      starY += 20
    }

    // Tràng sinh & Bác sỹ ở đáy ô
    ctx.font = '12px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#64748b'
    ctx.fillText(`${palace.changsheng12} • ${palace.boshi12}`, x + 16, y + cellH - 16)
  }

  // 5. Vẽ Thiên Bàn ở trung tâm (2x2)
  const tbX = margin + cellW
  const tbY = margin + cellH
  const tbW = cellW * 2
  const tbH = cellH * 2

  // Nền Thiên Bàn
  const tbGrad = ctx.createLinearGradient(tbX, tbY, tbX + tbW, tbY + tbH)
  tbGrad.addColorStop(0, 'rgba(99, 102, 241, 0.08)')
  tbGrad.addColorStop(1, 'rgba(168, 85, 247, 0.08)')
  ctx.fillStyle = tbGrad
  ctx.fillRect(tbX + 8, tbY + 8, tbW - 16, tbH - 16)

  ctx.strokeStyle = 'rgba(99, 102, 241, 0.25)'
  ctx.lineWidth = 1.5
  ctx.strokeRect(tbX + 8, tbY + 8, tbW - 16, tbH - 16)

  // Tiêu đề & Logo
  ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#818cf8'
  ctx.textAlign = 'center'
  ctx.fillText('THIÊN BÀN • LÁ SỐ TỬ VI ĐỔU SỐ', tbX + tbW / 2, tbY + 50)

  // Họ tên đương số
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(astrolabe.thienBan.name, tbX + tbW / 2, tbY + 105)

  // Giới tính, ngày giờ sinh
  ctx.font = '18px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#cbd5e1'
  ctx.fillText(
    `${astrolabe.thienBan.gender} • Năm ${astrolabe.thienBan.chineseDate.year} • ${astrolabe.thienBan.zodiac}`,
    tbX + tbW / 2,
    tbY + 145
  )

  ctx.font = '15px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText(`Dương lịch: ${astrolabe.thienBan.solarDate}`, tbX + tbW / 2, tbY + 180)
  ctx.fillText(`Âm lịch: ${astrolabe.thienBan.lunarDate}`, tbX + tbW / 2, tbY + 210)
  ctx.fillText(`Giờ sinh: ${astrolabe.thienBan.timeName} (${astrolabe.thienBan.timeRange})`, tbX + tbW / 2, tbY + 240)
  ctx.fillText(`Tứ Trụ: ${astrolabe.thienBan.chineseDate.full}`, tbX + tbW / 2, tbY + 270)

  // Cục & Mệnh ngũ hành
  ctx.font = 'bold 20px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#fbbf24'
  ctx.fillText(`Cục: ${astrolabe.thienBan.fiveElementsClass}`, tbX + tbW / 2, tbY + 315)

  // Chủ Mệnh, Chủ Thân
  ctx.font = '16px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#e2e8f0'
  ctx.fillText(
    `Chủ Mệnh: ${astrolabe.thienBan.soulStar}  |  Chủ Thân: ${astrolabe.thienBan.bodyStar}`,
    tbX + tbW / 2,
    tbY + 355
  )

  ctx.fillText(
    `Mệnh tại: ${astrolabe.thienBan.soulPalaceBranch}  |  Thân cư: ${astrolabe.thienBan.bodyPalaceBranch}`,
    tbX + tbW / 2,
    tbY + 388
  )

  // Cách cục
  if (astrolabe.patterns && astrolabe.patterns.length > 0) {
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif'
    ctx.fillStyle = '#a855f7'
    ctx.fillText(`Cách cục: ${astrolabe.patterns.join(', ')}`, tbX + tbW / 2, tbY + 430)
  }

  // Watermark
  ctx.font = '13px system-ui, -apple-system, sans-serif'
  ctx.fillStyle = '#64748b'
  ctx.fillText(`Tử Vi AI • Năm xem hạn ${astrolabe.thienBan.viewingYear}`, tbX + tbW / 2, tbY + tbH - 30)

  ctx.textAlign = 'left' // reset text align

  // 6. Kích hoạt tải ảnh PNG
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  const cleanName = astrolabe.thienBan.name.replace(/\s+/g, '_')
  link.download = `LaSo_TuVi_${cleanName}_${astrolabe.thienBan.chineseDate.year}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Chia sẻ lá số qua Web Share API hoặc sao chép văn bản tóm tắt
 */
export async function shareAstrolabe(
  astrolabe: NormalizedAstrolabe,
  onNotify?: (msg: { title: string; description?: string; color?: string }) => void
): Promise<void> {
  const shareData = {
    title: `Lá số Tử Vi của ${astrolabe.thienBan.name}`,
    text: `Lá số Tử Vi ${astrolabe.thienBan.name} (${astrolabe.thienBan.gender}, năm ${astrolabe.thienBan.chineseDate.year}, Cục: ${astrolabe.thienBan.fiveElementsClass}, Chủ Mệnh: ${astrolabe.thienBan.soulStar}).`,
    url: typeof window !== 'undefined' ? window.location.href : '',
  }

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share(shareData)
      onNotify?.({
        title: 'Đã chia sẻ thành công!',
        color: 'emerald',
      })
      return
    } catch {
      // Người dùng hủy chia sẻ hoặc không hỗ trợ, tiếp tục fallback
    }
  }

  // Fallback: Copy link và tóm tắt vào clipboard
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(`${shareData.text}\nXem tại: ${shareData.url}`)
      onNotify?.({
        title: 'Đã sao chép liên kết lá số!',
        description: 'Thông tin tóm tắt và đường dẫn đã được lưu vào bộ nhớ tạm.',
        color: 'indigo',
      })
      return
    } catch {
      // ignore
    }
  }

  onNotify?.({
    title: 'Chia sẻ lá số',
    description: `Lá số của ${astrolabe.thienBan.name}`,
    color: 'gray',
  })
}
