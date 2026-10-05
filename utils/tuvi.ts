import { astro, util } from 'iztro'
import type {
  AstrolabeInput,
  CanhGioInfo,
  NormalizedAstrolabe,
  NormalizedPalace,
  NormalizedStar,
  StarBrightness,
  StarMutagen,
  SurroundingPalacesInfo,
  ThienBan,
  YearlyHoroscope,
  YearlyHoroscopeRole,
} from '~/types/tuvi'

/**
 * Danh sách 12 Canh Giờ (kèm Tý sớm / Tý muộn) chuẩn Tử Vi Đẩu Số
 */
export const CANH_GIO_LIST: CanhGioInfo[] = [
  { index: 0, name: 'Tý sớm (00:00 - 01:00)', branch: 'Tý', timeRange: '00:00 ~ 01:00', description: 'Nửa đêm đầu ngày, dương khí manh nha' },
  { index: 1, name: 'Sửu (01:00 - 03:00)', branch: 'Sửu', timeRange: '01:00 ~ 03:00', description: 'Gà gáy đầu canh, chuẩn bị rạng đông' },
  { index: 2, name: 'Dần (03:00 - 05:00)', branch: 'Dần', timeRange: '03:00 ~ 05:00', description: 'Hừng đông, vạn vật chuyển mình' },
  { index: 3, name: 'Mão (05:00 - 07:00)', branch: 'Mão', timeRange: '05:00 ~ 07:00', description: 'Mặt trời mọc, bình minh chiếu rọi' },
  { index: 4, name: 'Thìn (07:00 - 09:00)', branch: 'Thìn', timeRange: '07:00 ~ 09:00', description: 'Ăn sáng, tinh thần phấn chấn' },
  { index: 5, name: 'Tỵ (09:00 - 11:00)', branch: 'Tỵ', timeRange: '09:00 ~ 11:00', description: 'Mặt trời lên cao, thời điểm sung sức' },
  { index: 6, name: 'Ngọ (11:00 - 13:00)', branch: 'Ngọ', timeRange: '11:00 ~ 13:00', description: 'Chính ngọ, dương khí cực thịnh' },
  { index: 7, name: 'Mùi (13:00 - 15:00)', branch: 'Mùi', timeRange: '13:00 ~ 15:00', description: 'Đầu giờ chiều, âm khí bắt đầu sinh' },
  { index: 8, name: 'Thân (15:00 - 17:00)', branch: 'Thân', timeRange: '15:00 ~ 17:00', description: 'Xế chiều, chuẩn bị hoàn tất công việc' },
  { index: 9, name: 'Dậu (17:00 - 19:00)', branch: 'Dậu', timeRange: '17:00 ~ 19:00', description: 'Hoàng hôn, mặt trời lặn sau núi' },
  { index: 10, name: 'Tuất (19:00 - 21:00)', branch: 'Tuất', timeRange: '19:00 ~ 21:00', description: 'Chập tối, nghỉ ngơi sum họp' },
  { index: 11, name: 'Hợi (21:00 - 23:00)', branch: 'Hợi', timeRange: '21:00 ~ 23:00', description: 'Đêm khuya tĩnh lặng, yên giấc' },
  { index: 12, name: 'Tý muộn (23:00 - 00:00)', branch: 'Tý', timeRange: '23:00 ~ 00:00', description: 'Cuối ngày cũ, giao hòa ngày mới' },
]

/**
 * Chuẩn hóa tên Cung theo GLOSSARY.md
 * Trong iztro vi-VN, childrenPalace dịch là "Tử Nữ", chuẩn Việt là "Tử Tức"
 */
export function normalizePalaceName(rawName: string): string {
  if (!rawName) return ''
  const trimmed = rawName.trim()
  if (trimmed === 'Tử Nữ') return 'Tử Tức'
  if (trimmed === 'Sự Nghiệp') return 'Quan Lộc'
  if (trimmed === 'Giao Hữu') return 'Nô Bộc'
  return trimmed
}

export const CAN_LIST = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý']
export const CHI_LIST = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi']

/**
 * Tính Can Chi của một năm Dương lịch (e.g. 2026 -> "Bính Ngọ", 2024 -> "Giáp Thìn")
 */
export function getCanChiOfYear(year: number): string {
  const canIndex = ((year - 4) % 10 + 10) % 10
  const chiIndex = ((year - 4) % 12 + 12) % 12
  return `${CAN_LIST[canIndex]} ${CHI_LIST[chiIndex]}`
}

/**
 * Tính toán dữ liệu Vận Hạn Lưu Niên của một năm cụ thể cho lá số
 */
export function calculateYearlyHoroscope(
  rawAstrolabe: ReturnType<typeof astro.bySolar>,
  normalizedPalaces: NormalizedPalace[],
  viewingYear: number
): YearlyHoroscope {
  // Lấy ngày giữa năm (01/06) của năm xem hạn để tính Lưu Niên ổn định
  const h = rawAstrolabe.horoscope(new Date(viewingYear, 5, 1))

  const palaceYearlyRoles: YearlyHoroscopeRole[] = normalizedPalaces.map((p, idx) => ({
    palaceIndex: p.index,
    originalPalaceName: p.name,
    yearlyRole: normalizePalaceName(h.yearly.palaceNames[idx] || ''),
    yearlyStars: (h.yearly.stars[idx] || []).map(s => s.name),
  }))

  const yearlySoulPalace = normalizedPalaces[h.yearly.index] || normalizedPalaces[0]
  const smallLimitPalace = normalizedPalaces[h.age.index] || normalizedPalaces[0]

  return {
    year: viewingYear,
    canChi: `${h.yearly.heavenlyStem} ${h.yearly.earthlyBranch}`,
    heavenlyStem: h.yearly.heavenlyStem,
    earthlyBranch: h.yearly.earthlyBranch,
    nominalAge: h.age.nominalAge,
    yearlySoulPalace: {
      index: yearlySoulPalace.index,
      originalPalaceName: yearlySoulPalace.name,
      earthlyBranch: yearlySoulPalace.earthlyBranch,
    },
    smallLimitPalace: {
      index: smallLimitPalace.index,
      originalPalaceName: smallLimitPalace.name,
      earthlyBranch: smallLimitPalace.earthlyBranch,
    },
    mutagens: {
      loc: h.yearly.mutagen[0] || '',
      quyen: h.yearly.mutagen[1] || '',
      khoa: h.yearly.mutagen[2] || '',
      ky: h.yearly.mutagen[3] || '',
    },
    palaceYearlyRoles,
  }
}

/**
 * Lấy hoặc tính toán Lưu Niên cho một lá số đã chuẩn hóa
 */
export function getOrCalculateYearlyHoroscope(
  astrolabe: NormalizedAstrolabe,
  targetYear?: number
): YearlyHoroscope | undefined {
  if (!astrolabe) return undefined
  const year = targetYear || astrolabe.thienBan?.viewingYear || new Date().getFullYear()

  if (astrolabe.horoscope && astrolabe.horoscope.year === year) {
    return astrolabe.horoscope
  }

  try {
    const { thienBan, palaces } = astrolabe
    if (!thienBan?.solarDate) return undefined

    // Tìm timeIndex tương ứng
    let timeIndex = 0
    if (thienBan.timeName) {
      const found = CANH_GIO_LIST.find(c => thienBan.timeName.startsWith(c.branch) || thienBan.timeName.includes(c.name))
      if (found) timeIndex = found.index
    }
    const iztroGender = isMaleGender(thienBan.gender) ? '男' : '女'
    const rawAstrolabe = astro.bySolar(thienBan.solarDate, timeIndex, iztroGender, true, 'vi-VN')
    return calculateYearlyHoroscope(rawAstrolabe, palaces, year)
  } catch (err) {
    console.warn('[TuVi Horoscope] Error calculating on-the-fly horoscope:', err)
    return undefined
  }
}

/**
 * Chuẩn hóa độ sáng miếu hãm của sao theo thuật ngữ Tử Vi Việt Nam chuẩn:
 * Miếu, Vượng, Đắc, Bình, Hãm
 */
export function normalizeBrightness(rawBrightness?: string): StarBrightness | undefined {
  if (!rawBrightness) return undefined
  const b = rawBrightness.trim()
  if (b === 'Miếu' || b === 'miao') return 'Miếu'
  if (b === 'Vượng' || b === 'wang') return 'Vượng'
  if (b === 'Đắc' || b === 'de' || b === 'Lợi' || b === 'li') return 'Đắc'
  if (b === 'Bình' || b === 'ping' || b === 'Bất' || b === 'bu') return 'Bình'
  if (b === 'Hãm' || b === 'Hạn' || b === 'xian') return 'Hãm'
  return (b as StarBrightness) || undefined
}

/**
 * Chuẩn hóa Tứ Hóa: Lộc, Quyền, Khoa, Kỵ
 */
export function normalizeMutagen(rawMutagen?: string): StarMutagen {
  if (!rawMutagen) return ''
  const m = rawMutagen.trim()
  if (m === 'Lộc' || m === 'sihuaLu') return 'Lộc'
  if (m === 'Quyền' || m === 'sihuaQuan') return 'Quyền'
  if (m === 'Khoa' || m === 'sihuaKe') return 'Khoa'
  if (m === 'Kỵ' || m === 'sihuaJi') return 'Kỵ'
  return ''
}

/**
 * Chuyển đổi giờ phút thành timeIndex của iztro (0..12)
 */
export function getTimeIndexFromHourMinute(hour: number, minute: number = 0): number {
  if (hour === 23) return 12 // Tý muộn
  if (hour === 0) return 0 // Tý sớm
  return util.timeToIndex(hour)
}

/**
 * Tìm thông tin Canh Giờ dựa vào timeIndex
 */
export function getCanhGioInfo(timeIndex: number): CanhGioInfo {
  const found = CANH_GIO_LIST.find(c => c.index === timeIndex)
  return found || CANH_GIO_LIST[0]
}

/**
 * Định dạng ngày Âm Lịch tiếng Việt chuẩn
 */
export function formatLunarDateVietnamese(
  lunarDay: number,
  lunarMonth: number,
  yearCanChi: string,
  isLeap: boolean = false
): string {
  const leapText = isLeap ? ' (Nhuận)' : ''
  return `Ngày ${lunarDay} tháng ${lunarMonth}${leapText} năm ${yearCanChi} (Âm lịch)`
}

/**
 * Nhận diện các cách cục lớn trên lá số
 */
export function detectMajorPatterns(palaces: NormalizedPalace[]): string[] {
  const patterns: string[] = []
  const menhPalace = palaces.find(p => p.name === 'Mệnh')
  if (!menhPalace) return patterns

  const majorStarNames = menhPalace.majorStars.map(s => s.name)

  // 1. Kiểm tra Vô Chính Diệu
  if (majorStarNames.length === 0) {
    patterns.push('Mệnh Vô Chính Diệu')
  }

  // 2. Tìm tam phương tứ chính của cung Mệnh (Mệnh, Quan Lộc, Tài Bạch, Thiên Di)
  const quanPalace = palaces.find(p => p.name === 'Quan Lộc')
  const taiPalace = palaces.find(p => p.name === 'Tài Bạch')
  const diPalace = palaces.find(p => p.name === 'Thiên Di')

  const surroundingMajorStars = new Set<string>()
  ;[menhPalace, quanPalace, taiPalace, diPalace].forEach(p => {
    p?.majorStars.forEach(s => surroundingMajorStars.add(s.name))
  })

  // Sát Phá Tham: Mệnh hoặc tam hợp có Thất Sát, Phá Quân, Tham Lang
  const hasSat = surroundingMajorStars.has('Thất Sát')
  const hasPha = surroundingMajorStars.has('Phá Quân')
  const hasTham = surroundingMajorStars.has('Tham Lang')
  if (hasSat && hasPha && hasTham) {
    patterns.push('Sát Phá Tham')
  }

  // Tử Phủ Vũ Tướng: Có Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng
  const hasTuVi = surroundingMajorStars.has('Tử Vi')
  const hasThienPhu = surroundingMajorStars.has('Thiên Phủ')
  const hasVuKhuc = surroundingMajorStars.has('Vũ Khúc')
  const hasThienTuong = surroundingMajorStars.has('Thiên Tướng')
  if ((hasTuVi || hasThienPhu) && (hasVuKhuc || hasThienTuong)) {
    patterns.push('Tử Phủ Vũ Tướng')
  }

  // Cơ Nguyệt Đồng Lương: Có Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương
  const hasCo = surroundingMajorStars.has('Thiên Cơ')
  const hasNguyet = surroundingMajorStars.has('Thái Âm')
  const hasDong = surroundingMajorStars.has('Thiên Đồng')
  const hasLuong = surroundingMajorStars.has('Thiên Lương')
  if ((hasCo && hasNguyet) || (hasDong && hasLuong) || (hasCo && hasLuong)) {
    patterns.push('Cơ Nguyệt Đồng Lương')
  }

  // Cự Nhật: Cự Môn và Thái Dương đồng cung hoặc hội chiếu
  const hasCu = surroundingMajorStars.has('Cự Môn')
  const hasNhat = surroundingMajorStars.has('Thái Dương')
  if (hasCu && hasNhat) {
    patterns.push('Cự Nhật Hội Chiếu')
  }

  // Nhật Nguyệt Tịnh Minh / Đồng Minh: Thái Dương & Thái Âm miếu vượng
  const sunStar = menhPalace.majorStars.find(s => s.name === 'Thái Dương')
  const moonStar = menhPalace.majorStars.find(s => s.name === 'Thái Âm')
  if (
    (sunStar?.brightness === 'Miếu' || sunStar?.brightness === 'Vượng') &&
    (moonStar?.brightness === 'Miếu' || moonStar?.brightness === 'Vượng')
  ) {
    patterns.push('Nhật Nguyệt Tịnh Minh')
  }

  // Lộc Mã Giao Trì: Cung Mệnh hoặc Tài có Hóa Lộc / Lộc Tồn cùng Thiên Mã
  const allMenhMinor = [...menhPalace.minorStars, ...menhPalace.majorStars]
  const hasLoc = allMenhMinor.some(s => s.name === 'Lộc Tồn' || s.mutagen === 'Lộc')
  const hasMa = allMenhMinor.some(s => s.name === 'Thiên Mã')
  if (hasLoc && hasMa) {
    patterns.push('Lộc Mã Giao Trì')
  }

  return patterns
}

/**
 * Hàm an sao và chuẩn hóa lá số Tử Vi hoàn chỉnh
 */
export function createAstrolabe(input: AstrolabeInput): NormalizedAstrolabe {
  const {
    name,
    gender,
    calendarType,
    year,
    month,
    day,
    hour,
    minute,
    timeIndex: providedTimeIndex,
    isLeapMonth = false,
    viewingYear = new Date().getFullYear(),
  } = input

  // Xác định timeIndex chuẩn xác
  let timeIndex: number
  if (providedTimeIndex !== undefined && providedTimeIndex >= 0 && providedTimeIndex <= 12) {
    timeIndex = providedTimeIndex
  } else if (hour !== undefined) {
    timeIndex = getTimeIndexFromHourMinute(hour, minute || 0)
  } else {
    timeIndex = 0 // Mặc định giờ Tý
  }

  // iztro nhận '男' | '女'
  const iztroGender = gender === 'nam' ? '男' : '女'
  const dateStr = `${year}-${month}-${day}`

  let rawAstrolabe: ReturnType<typeof astro.bySolar>
  if (calendarType === 'lunar') {
    rawAstrolabe = astro.byLunar(dateStr, timeIndex, iztroGender, isLeapMonth, true, 'vi-VN')
  } else {
    rawAstrolabe = astro.bySolar(dateStr, timeIndex, iztroGender, true, 'vi-VN')
  }

  // Phân tích Can Chi 4 trụ từ chuỗi chineseDate (e.g. "Canh Thìn - Giáp Thân - Bính Ngọ - Canh Dần")
  const chineseDateParts = rawAstrolabe.chineseDate.split('-').map(p => p.trim())
  const yearCanChi = chineseDateParts[0] || ''
  const monthCanChi = chineseDateParts[1] || ''
  const dayCanChi = chineseDateParts[2] || ''
  const hourCanChi = chineseDateParts[3] || ''

  const lunarRaw = rawAstrolabe.rawDates.lunarDate
  const lunarDateVietnamese = formatLunarDateVietnamese(
    lunarRaw.lunarDay,
    lunarRaw.lunarMonth,
    yearCanChi,
    lunarRaw.isLeap
  )

  const canhGio = getCanhGioInfo(timeIndex)

  // Chuẩn hóa 12 Cung
  const normalizedPalaces: NormalizedPalace[] = rawAstrolabe.palaces.map(p => {
    const majorStars: NormalizedStar[] = p.majorStars.map(s => ({
      name: s.name,
      type: 'major',
      scope: s.scope,
      brightness: normalizeBrightness(s.brightness),
      mutagen: normalizeMutagen(s.mutagen),
    }))

    const minorStars: NormalizedStar[] = p.minorStars.map(s => ({
      name: s.name,
      type: s.type,
      scope: s.scope,
      brightness: normalizeBrightness(s.brightness),
      mutagen: normalizeMutagen(s.mutagen),
    }))

    const adjectiveStars: NormalizedStar[] = p.adjectiveStars.map(s => ({
      name: s.name,
      type: s.type,
      scope: s.scope,
      brightness: normalizeBrightness(s.brightness),
      mutagen: normalizeMutagen(s.mutagen),
    }))

    return {
      index: p.index,
      name: normalizePalaceName(p.name),
      isBodyPalace: Boolean(p.isBodyPalace),
      isOriginalPalace: Boolean(p.isOriginalPalace),
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch,
      majorStars,
      minorStars,
      adjectiveStars,
      changsheng12: p.changsheng12,
      boshi12: p.boshi12,
      jiangqian12: p.jiangqian12,
      suiqian12: p.suiqian12,
      decadal: {
        range: p.decadal.range,
        heavenlyStem: p.decadal.heavenlyStem,
        earthlyBranch: p.decadal.earthlyBranch,
      },
      ages: [...p.ages],
    }
  })

  // Tìm cung Mệnh và cung Thân
  const menhPalace = normalizedPalaces.find(p => p.name === 'Mệnh')
  const thanPalace = normalizedPalaces.find(p => p.isBodyPalace)

  const thienBan: ThienBan = {
    name: name?.trim() || 'Đương số',
    gender: gender === 'nam' ? 'Nam' : 'Nữ',
    solarDate: rawAstrolabe.solarDate,
    lunarDate: lunarDateVietnamese,
    lunarDateRaw: {
      lunarYear: lunarRaw.lunarYear,
      lunarMonth: lunarRaw.lunarMonth,
      lunarDay: lunarRaw.lunarDay,
      isLeap: lunarRaw.isLeap,
    },
    chineseDate: {
      year: yearCanChi,
      month: monthCanChi,
      day: dayCanChi,
      hour: hourCanChi,
      full: rawAstrolabe.chineseDate,
    },
    timeRange: canhGio.timeRange,
    timeName: canhGio.name,
    fiveElementsClass: rawAstrolabe.fiveElementsClass,
    soulStar: rawAstrolabe.soul,
    bodyStar: rawAstrolabe.body,
    zodiac: rawAstrolabe.zodiac,
    sign: rawAstrolabe.sign,
    soulPalaceBranch: menhPalace?.earthlyBranch || rawAstrolabe.earthlyBranchOfSoulPalace,
    bodyPalaceBranch: thanPalace?.earthlyBranch || rawAstrolabe.earthlyBranchOfBodyPalace,
    viewingYear,
  }

  const patterns = detectMajorPatterns(normalizedPalaces)

  let horoscope: YearlyHoroscope | undefined
  try {
    horoscope = calculateYearlyHoroscope(rawAstrolabe, normalizedPalaces, viewingYear)
  } catch (err) {
    console.warn('[TuVi Horoscope] Failed to calculate yearly horoscope in createAstrolabe:', err)
  }

  const id = `tuvi_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  return {
    id,
    thienBan,
    palaces: normalizedPalaces,
    patterns,
    horoscope,
    createdAt: new Date().toISOString(),
  }
}

/**
 * Lấy cung theo tên
 */
export function getPalaceByName(
  astrolabe: NormalizedAstrolabe,
  palaceName: string
): NormalizedPalace | undefined {
  if (!astrolabe || !Array.isArray(astrolabe.palaces)) return undefined
  const normalized = normalizePalaceName(palaceName)
  return astrolabe.palaces.find(p => p.name === normalized)
}

/**
 * Lấy tam phương tứ chính của một cung (Cung hiện tại, Xung chiếu, và 2 Cung tam hợp)
 */
export function getSurroundingPalaces(
  astrolabe: NormalizedAstrolabe,
  targetPalaceNameOrIndex: string | number
): SurroundingPalacesInfo | undefined {
  if (!astrolabe || !Array.isArray(astrolabe.palaces)) return undefined
  let targetIndex: number
  if (typeof targetPalaceNameOrIndex === 'number') {
    targetIndex = targetPalaceNameOrIndex
  } else {
    const p = getPalaceByName(astrolabe, targetPalaceNameOrIndex)
    if (!p) return undefined
    targetIndex = p.index
  }

  const target = astrolabe.palaces.find(p => p.index === targetIndex)
  if (!target) return undefined

  // Trong chu kỳ 12 cung:
  // Cung xung chiếu: cách 6 cung (index + 6) % 12
  // Cung tam hợp 1: cách 4 cung (index + 4) % 12
  // Cung tam hợp 2: cách 8 cung (index + 8) % 12
  const oppositeIndex = (targetIndex + 6) % 12
  const wealthIndex = (targetIndex + 4) % 12
  const careerIndex = (targetIndex + 8) % 12

  const opposite = astrolabe.palaces.find(p => p.index === oppositeIndex)!
  const wealth = astrolabe.palaces.find(p => p.index === wealthIndex)!
  const career = astrolabe.palaces.find(p => p.index === careerIndex)!

  return {
    target,
    opposite,
    wealth,
    career,
  }
}

/**
 * Trả về class Tailwind CSS cho huy hiệu Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ)
 */
export function getElementBadgeClass(elementClass: string = ''): string {
  if (elementClass.includes('Kim')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20'
  if (elementClass.includes('Mộc')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20'
  if (elementClass.includes('Thủy')) return 'bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/20'
  if (elementClass.includes('Hỏa')) return 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20'
  if (elementClass.includes('Thổ')) return 'bg-orange-500/10 text-orange-600 dark:text-orange-300 border-orange-500/20'
  return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border-indigo-500/20'
}

/**
 * Trả về class Tailwind CSS cho huy hiệu Tứ Hóa (Lộc, Quyền, Khoa, Kỵ)
 */
export function getMutagenBadgeClass(mutagen?: string): string {
  switch (mutagen) {
    case 'Lộc':
      return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
    case 'Quyền':
      return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
    case 'Khoa':
      return 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30'
    case 'Kỵ':
      return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30'
    default:
      return ''
  }
}

export interface BranchGridCoordinate {
  row: number // 1-indexed (1..4) cho CSS Grid
  col: number // 1-indexed (1..4) cho CSS Grid
}

/**
 * Tọa độ chuẩn của 12 Địa Chi trên ma trận 4x4 truyền thống
 * 12 cung xếp theo chiều kim đồng hồ quanh chu vi, trung tâm 2x2 là Thiên Bàn
 */
export const BRANCH_GRID_COORDINATES: Record<string, BranchGridCoordinate> = {
  'Tỵ': { row: 1, col: 1 },
  'Ngọ': { row: 1, col: 2 },
  'Mùi': { row: 1, col: 3 },
  'Thân': { row: 1, col: 4 },
  'Dậu': { row: 2, col: 4 },
  'Tuất': { row: 3, col: 4 },
  'Hợi': { row: 4, col: 4 },
  'Tý': { row: 4, col: 3 },
  'Sửu': { row: 4, col: 2 },
  'Dần': { row: 4, col: 1 },
  'Mão': { row: 3, col: 1 },
  'Thìn': { row: 2, col: 1 },
}

/**
 * Kiểm tra giới tính nam
 */
export function isMaleGender(gender?: string): boolean {
  if (!gender) return false
  const g = gender.trim().toLowerCase()
  return g === 'nam' || g === '男'
}

