import { describe, expect, it } from 'vitest'
import {
  CANH_GIO_LIST,
  createAstrolabe,
  detectMajorPatterns,
  getCanhGioInfo,
  getElementBadgeClass,
  getMutagenBadgeClass,
  getPalaceByName,
  getSurroundingPalaces,
  getTimeIndexFromHourMinute,
  normalizeBrightness,
  normalizeMutagen,
  normalizePalaceName,
  BRANCH_GRID_COORDINATES,
  isMaleGender,
  getCanChiOfYear,
} from '../utils/tuvi'
import {
  ASSISTANT_STARS_KNOWLEDGE,
  MAJOR_STARS_KNOWLEDGE,
  MUTAGENS_KNOWLEDGE,
  PAIRED_STARS_KNOWLEDGE,
  PALACES_KNOWLEDGE,
  PATTERNS_KNOWLEDGE,
  TRUNG_CHAU_METHODOLOGY,
} from '../server/data/knowledge'
import { extractPalaceKnowledge, retrieveAstrologyContext } from '../server/utils/rag'
import type { AstrolabeInput } from '../types/tuvi'

describe('TuVi Engine & iztro wrapper', () => {
  it('correctly maps 12 Canh Giờ from hour and minute', () => {
    expect(getTimeIndexFromHourMinute(0, 30)).toBe(0) // Tý sớm
    expect(getTimeIndexFromHourMinute(2, 0)).toBe(1) // Sửu
    expect(getTimeIndexFromHourMinute(4, 15)).toBe(2) // Dần
    expect(getTimeIndexFromHourMinute(6, 45)).toBe(3) // Mão
    expect(getTimeIndexFromHourMinute(12, 0)).toBe(6) // Ngọ
    expect(getTimeIndexFromHourMinute(23, 15)).toBe(12) // Tý muộn

    const canhGioDan = getCanhGioInfo(2)
    expect(canhGioDan.branch).toBe('Dần')
    expect(canhGioDan.timeRange).toBe('03:00 ~ 05:00')
  })

  it('normalizes palace names according to GLOSSARY.md (Tử Nữ -> Tử Tức)', () => {
    expect(normalizePalaceName('Tử Nữ')).toBe('Tử Tức')
    expect(normalizePalaceName('Mệnh')).toBe('Mệnh')
    expect(normalizePalaceName('Quan Lộc')).toBe('Quan Lộc')
  })

  it('normalizes star brightness to standard Vietnamese Tử Vi terms', () => {
    expect(normalizeBrightness('Miếu')).toBe('Miếu')
    expect(normalizeBrightness('Vượng')).toBe('Vượng')
    expect(normalizeBrightness('Đắc')).toBe('Đắc')
    expect(normalizeBrightness('Lợi')).toBe('Đắc')
    expect(normalizeBrightness('Bình')).toBe('Bình')
    expect(normalizeBrightness('Bất')).toBe('Bình')
    expect(normalizeBrightness('Hạn')).toBe('Hãm') // iztro typo for 陷
    expect(normalizeBrightness('xian')).toBe('Hãm')
  })

  it('normalizes mutagen (Tứ Hóa)', () => {
    expect(normalizeMutagen('Lộc')).toBe('Lộc')
    expect(normalizeMutagen('Quyền')).toBe('Quyền')
    expect(normalizeMutagen('Khoa')).toBe('Khoa')
    expect(normalizeMutagen('Kỵ')).toBe('Kỵ')
    expect(normalizeMutagen(undefined)).toBe('')
  })

  it('correctly maps element badge CSS classes for Five Elements', () => {
    expect(getElementBadgeClass('Kim Tứ Cục')).toContain('amber')
    expect(getElementBadgeClass('Mộc Tam Cục')).toContain('emerald')
    expect(getElementBadgeClass('Thủy Nhị Cục')).toContain('sky')
    expect(getElementBadgeClass('Hỏa Lục Cục')).toContain('rose')
    expect(getElementBadgeClass('Thổ Ngũ Cục')).toContain('orange')
  })

  it('correctly maps mutagen badge CSS classes for Tứ Hóa', () => {
    expect(getMutagenBadgeClass('Lộc')).toContain('emerald')
    expect(getMutagenBadgeClass('Quyền')).toContain('rose')
    expect(getMutagenBadgeClass('Khoa')).toContain('sky')
    expect(getMutagenBadgeClass('Kỵ')).toContain('purple')
    expect(getMutagenBadgeClass('')).toBe('')
  })

  it('correctly maps 12 Earthly Branches to 4x4 matrix coordinates', () => {
    expect(BRANCH_GRID_COORDINATES['Tỵ']).toEqual({ row: 1, col: 1 })
    expect(BRANCH_GRID_COORDINATES['Ngọ']).toEqual({ row: 1, col: 2 })
    expect(BRANCH_GRID_COORDINATES['Mùi']).toEqual({ row: 1, col: 3 })
    expect(BRANCH_GRID_COORDINATES['Thân']).toEqual({ row: 1, col: 4 })
    expect(BRANCH_GRID_COORDINATES['Dậu']).toEqual({ row: 2, col: 4 })
    expect(BRANCH_GRID_COORDINATES['Tuất']).toEqual({ row: 3, col: 4 })
    expect(BRANCH_GRID_COORDINATES['Hợi']).toEqual({ row: 4, col: 4 })
    expect(BRANCH_GRID_COORDINATES['Tý']).toEqual({ row: 4, col: 3 })
    expect(BRANCH_GRID_COORDINATES['Sửu']).toEqual({ row: 4, col: 2 })
    expect(BRANCH_GRID_COORDINATES['Dần']).toEqual({ row: 4, col: 1 })
    expect(BRANCH_GRID_COORDINATES['Mão']).toEqual({ row: 3, col: 1 })
    expect(BRANCH_GRID_COORDINATES['Thìn']).toEqual({ row: 2, col: 1 })
  })

  it('checks gender correctly with isMaleGender', () => {
    expect(isMaleGender('nam')).toBe(true)
    expect(isMaleGender('Nam')).toBe(true)
    expect(isMaleGender('男')).toBe(true)
    expect(isMaleGender('nu')).toBe(false)
    expect(isMaleGender('Nữ')).toBe(false)
    expect(isMaleGender('')).toBe(false)
  })

  it('creates a normalized astrolabe from Solar date input', () => {
    const input: AstrolabeInput = {
      name: 'Nguyễn Văn A',
      gender: 'nam',
      calendarType: 'solar',
      year: 2000,
      month: 8,
      day: 16,
      hour: 3,
      minute: 30,
      viewingYear: 2026,
    }

    const astrolabe = createAstrolabe(input)

    expect(astrolabe).toBeDefined()
    expect(astrolabe.id).toMatch(/^tuvi_/)
    expect(astrolabe.thienBan.name).toBe('Nguyễn Văn A')
    expect(astrolabe.thienBan.gender).toBe('Nam')
    expect(astrolabe.thienBan.solarDate).toBe('2000-8-16')
    expect(astrolabe.thienBan.fiveElementsClass).toBe('Mộc Tam Cục')
    expect(astrolabe.thienBan.chineseDate.year).toBe('Canh Thìn')
    expect(astrolabe.thienBan.lunarDate).toContain('Âm lịch')
    expect(astrolabe.thienBan.timeRange).toBe('03:00 ~ 05:00')

    // Check 12 palaces
    expect(astrolabe.palaces).toHaveLength(12)
    const palaceNames = astrolabe.palaces.map(p => p.name)
    expect(palaceNames).toContain('Mệnh')
    expect(palaceNames).toContain('Quan Lộc')
    expect(palaceNames).toContain('Tài Bạch')
    expect(palaceNames).toContain('Phu Thê')
    expect(palaceNames).toContain('Tử Tức') // normalized from Tử Nữ

    // Check palace Mệnh
    const menh = getPalaceByName(astrolabe, 'Mệnh')
    expect(menh).toBeDefined()
    expect(menh?.earthlyBranch).toBe('Ngọ')
    expect(menh?.majorStars.length).toBeGreaterThan(0)
    expect(menh?.majorStars[0].name).toBe('Tử Vi')
    expect(menh?.majorStars[0].brightness).toBe('Miếu')
  })

  it('creates an astrolabe from Lunar date input and 12 Canh Giờ timeIndex', () => {
    const input: AstrolabeInput = {
      name: 'Trần Thị B',
      gender: 'nu',
      calendarType: 'lunar',
      year: 2000,
      month: 7,
      day: 17,
      timeIndex: 2, // Giờ Dần
    }

    const astrolabe = createAstrolabe(input)

    expect(astrolabe.thienBan.gender).toBe('Nữ')
    expect(astrolabe.thienBan.solarDate).toBe('2000-8-16')
    expect(astrolabe.thienBan.lunarDateRaw.lunarMonth).toBe(7)
    expect(astrolabe.thienBan.lunarDateRaw.lunarDay).toBe(17)
  })

  it('calculates tam phương tứ chính correctly', () => {
    const input: AstrolabeInput = {
      name: 'Lê Văn C',
      gender: 'nam',
      calendarType: 'solar',
      year: 2000,
      month: 8,
      day: 16,
      hour: 4,
    }

    const astrolabe = createAstrolabe(input)
    const surrounding = getSurroundingPalaces(astrolabe, 'Mệnh')

    expect(surrounding).toBeDefined()
    expect(surrounding?.target.name).toBe('Mệnh')
    expect(surrounding?.opposite.name).toBe('Thiên Di')
    // Tam hợp của Mệnh là Tài Bạch và Quan Lộc
    const trineNames = [surrounding?.wealth.name, surrounding?.career.name]
    expect(trineNames).toContain('Tài Bạch')
    expect(trineNames).toContain('Quan Lộc')
  })
})

describe('Structured Domain RAG Knowledge Base', () => {
  it('covers all 14 major stars with rich metadata', () => {
    const expected14Stars = [
      'Tử Vi',
      'Liêm Trinh',
      'Thiên Đồng',
      'Vũ Khúc',
      'Thái Dương',
      'Thiên Cơ',
      'Thiên Phủ',
      'Thái Âm',
      'Tham Lang',
      'Cự Môn',
      'Thiên Tướng',
      'Thiên Lương',
      'Thất Sát',
      'Phá Quân',
    ]

    for (const starName of expected14Stars) {
      const star = MAJOR_STARS_KNOWLEDGE[starName]
      expect(star, `Missing knowledge for major star ${starName}`).toBeDefined()
      expect(star.name).toBe(starName)
      expect(star.element).toBeTruthy()
      expect(star.role).toBeTruthy()
      expect(star.coreMeaning.length).toBeGreaterThan(30)
      expect(star.careerAdvice.length).toBeGreaterThan(20)
      expect(star.wealthAdvice.length).toBeGreaterThan(20)
      expect(Object.keys(star.brightnessMeaning).length).toBeGreaterThanOrEqual(3)
    }
  })

  it('covers all 12 palaces with life domains according to GLOSSARY.md', () => {
    const expected12Palaces = [
      'Mệnh',
      'Phụ Mẫu',
      'Phúc Đức',
      'Điền Trạch',
      'Quan Lộc',
      'Nô Bộc',
      'Thiên Di',
      'Tật Ách',
      'Tài Bạch',
      'Tử Tức',
      'Phu Thê',
      'Huynh Đệ',
    ]

    for (const pName of expected12Palaces) {
      const palace = PALACES_KNOWLEDGE[pName]
      expect(palace, `Missing knowledge for palace ${pName}`).toBeDefined()
      expect(palace.name).toBe(pName)
      expect(palace.lifeDomain).toBeTruthy()
      expect(palace.coreMeaning.length).toBeGreaterThan(30)
      expect(palace.counselingFocus.length).toBeGreaterThan(20)
      expect(palace.oppositePalaceName).toBeTruthy()
      expect(palace.trinePalaceNames).toHaveLength(2)
    }
  })

  it('covers core major patterns', () => {
    const expectedPatterns = [
      'Tử Phủ Vũ Tướng',
      'Sát Phá Tham',
      'Cơ Nguyệt Đồng Lương',
      'Cự Nhật Hội Chiếu',
      'Mệnh Vô Chính Diệu',
      'Nhật Nguyệt Tịnh Minh',
      'Lộc Mã Giao Trì',
    ]

    for (const pat of expectedPatterns) {
      const pattern = PATTERNS_KNOWLEDGE[pat]
      expect(pattern, `Missing knowledge for pattern ${pat}`).toBeDefined()
      expect(pattern.characteristics.length).toBeGreaterThan(30)
      expect(pattern.strategicAdvice.length).toBeGreaterThan(20)
    }
  })

  it('covers authentic Trung Châu Phái special patterns and mutagens', () => {
    const specialPatterns = [
      'Phủ Tướng Triều Viên',
      'Sát Phá Lang',
      'Dương Lương Xương Lộc',
      'Tài Ấm Giáp Ấn',
      'Hình Kỵ Giáp Ấn',
      'Hỏa Tham & Linh Tham',
      'Bách Quan Triều Củng',
      'Tại Dã Cô Quân',
      'Lộc Văn Củng Mệnh',
      'Linh Xương Đà Vũ',
      'Dương Đà Giáp Kỵ',
    ]

    for (const pat of specialPatterns) {
      const pattern = PATTERNS_KNOWLEDGE[pat]
      expect(pattern, `Missing special pattern ${pat}`).toBeDefined()
      expect(pattern.characteristics.length).toBeGreaterThan(30)
      expect(pattern.strategicAdvice.length).toBeGreaterThan(20)
    }

    // Mutagens (Tứ Hóa)
    expect(MUTAGENS_KNOWLEDGE['Lộc']).toBeDefined()
    expect(MUTAGENS_KNOWLEDGE['Quyền']).toBeDefined()
    expect(MUTAGENS_KNOWLEDGE['Khoa']).toBeDefined()
    expect(MUTAGENS_KNOWLEDGE['Kỵ']).toBeDefined()
  })

  it('covers all 12 palace influences for all 14 major stars', () => {
    const palaces = [
      'Mệnh',
      'Huynh Đệ',
      'Phu Thê',
      'Tài Bạch',
      'Tật Ách',
      'Thiên Di',
      'Điền Trạch',
      'Phúc Đức',
      'Phụ Mẫu',
    ]

    for (const [starName, starK] of Object.entries(MAJOR_STARS_KNOWLEDGE)) {
      expect(starK.element).toBeTruthy()
      expect(starK.role).toBeTruthy()
      expect(starK.coreMeaning.length).toBeGreaterThan(50)

      for (const pName of palaces) {
        const influence = starK.palaceInfluences[pName as keyof typeof starK.palaceInfluences]
        expect(influence, `Star ${starName} missing influence for palace ${pName}`).toBeTruthy()
        expect(influence!.length).toBeGreaterThan(20)
      }
    }
  })

  it('covers Assistant Stars, Paired Stars, and Methodology from Trung Châu Phái', () => {
    // 14 Assistant / Sha stars
    const expectedAssistant = [
      'Tả Phụ',
      'Hữu Bật',
      'Thiên Khôi',
      'Thiên Việt',
      'Văn Xương',
      'Văn Khúc',
      'Lộc Tồn',
      'Thiên Mã',
      'Kình Dương',
      'Đà La',
      'Hỏa Tinh',
      'Linh Tinh',
      'Địa Không',
      'Địa Kiếp',
    ]

    for (const starName of expectedAssistant) {
      const aK = ASSISTANT_STARS_KNOWLEDGE[starName]
      expect(aK, `Missing assistant star knowledge for ${starName}`).toBeDefined()
      expect(aK.coreNature.length).toBeGreaterThan(20)
      expect(aK.auspiciousEffect.length).toBeGreaterThan(15)
      expect(aK.inauspiciousEffect.length).toBeGreaterThan(15)
    }

    // Paired stars principle (Kiến Tinh Tầm Ngẫu)
    expect(PAIRED_STARS_KNOWLEDGE.pairs.length).toBeGreaterThan(0)
    expect(PAIRED_STARS_KNOWLEDGE.interactionLevels).toHaveLength(4)

    // Methodology (4 steps & special techniques)
    expect(TRUNG_CHAU_METHODOLOGY.steps).toHaveLength(4)
    expect(TRUNG_CHAU_METHODOLOGY.specialTechniques.some(t => t.name.includes('Tá Tinh An Cung'))).toBe(true)
    expect(TRUNG_CHAU_METHODOLOGY.specialTechniques.some(t => t.name.includes('Tinh Diệu Hỗ Thiệp'))).toBe(true)
  })
})

describe('Structured Domain RAG Retrieval', () => {
  const sampleInput: AstrolabeInput = {
    name: 'Phan Minh Tuấn',
    gender: 'nam',
    calendarType: 'solar',
    year: 1995,
    month: 10,
    day: 24,
    hour: 8,
    minute: 30,
    viewingYear: 2026,
  }

  const astrolabe = createAstrolabe(sampleInput)

  it('retrieves comprehensive 4-pillar overview context when targetPalace is omitted', () => {
    const result = retrieveAstrologyContext(astrolabe)

    expect(result.astrolabeId).toBe(astrolabe.id)
    expect(result.targetPalace).toBeUndefined()
    expect(result.knowledgeMarkdown).toContain('THÔNG TIN ĐƯƠNG SỐ (THIÊN BÀN)')
    expect(result.knowledgeMarkdown).toContain('Phan Minh Tuấn')
    expect(result.knowledgeMarkdown).toContain('TRI THỨC 4 CUNG NÒNG CỐT')
    expect(result.knowledgeMarkdown).toContain('Cung Mệnh')
    expect(result.knowledgeMarkdown).toContain('Cung Quan Lộc')
    expect(result.knowledgeMarkdown).toContain('Cung Tài Bạch')
    expect(result.knowledgeMarkdown).toContain('Cung Phu Thê')
    expect(result.knowledgeMarkdown).toContain('NGUYÊN TẮC LUẬN GIẢI & CỐ VẤN CUỘC SỐNG')
    expect(result.palaceContexts['Mệnh']).toBeDefined()
    expect(result.palaceContexts['Quan Lộc']).toBeDefined()
    expect(result.palaceContexts['Tài Bạch']).toBeDefined()
    expect(result.palaceContexts['Phu Thê']).toBeDefined()
  })

  it('retrieves deep targeted context when targetPalace is specified', () => {
    const result = retrieveAstrologyContext(astrolabe, 'Quan Lộc')

    expect(result.targetPalace).toBe('Quan Lộc')
    expect(result.knowledgeMarkdown).toContain('TRI THỨC CHUYÊN SÂU CUNG QUAN LỘC')
    expect(result.knowledgeMarkdown).toContain('Sự nghiệp, vị thế xã hội')
    expect(result.knowledgeMarkdown).toContain('Tam phương tứ chính hội chiếu')
    expect(result.palaceContexts['Quan Lộc']).toBeDefined()
  })

  it('extracts rich palace knowledge with stars, brightness and mutagens', () => {
    const menhPalace = getPalaceByName(astrolabe, 'Mệnh')!
    const context = extractPalaceKnowledge(astrolabe, menhPalace)

    expect(context).toContain('Cung Mệnh')
    expect(context).toContain('Phương diện')
    expect(context).toContain('Tam phương tứ chính')
  })

  it('guarantees normalized astrolabe is purely serializable (no circular refs)', () => {
    const jsonString = JSON.stringify(astrolabe)
    expect(jsonString).toBeTruthy()
    const parsed = JSON.parse(jsonString)
    expect(parsed.thienBan.name).toBe('Phan Minh Tuấn')
    expect(parsed.palaces).toHaveLength(12)
  })

  it('handles lunar calendar with leap month properly', () => {
    // Năm 2023 Quý Mão có tháng 2 nhuận
    const leapInput: AstrolabeInput = {
      name: 'Vũ Thị Mão',
      gender: 'nu',
      calendarType: 'lunar',
      year: 2023,
      month: 2,
      day: 15,
      isLeapMonth: true,
      hour: 10,
    }
    const leapAstrolabe = createAstrolabe(leapInput)
    expect(leapAstrolabe).toBeDefined()
    expect(leapAstrolabe.thienBan.lunarDate).toContain('Nhuận')
    expect(leapAstrolabe.thienBan.gender).toBe('Nữ')
  })

  it('strictly adheres to GLOSSARY.md avoidance rules (no Cục số, no Đại vận 10 năm)', () => {
    const ragContext = retrieveAstrologyContext(astrolabe)
    expect(ragContext.knowledgeMarkdown).not.toContain('Cục số')
    expect(ragContext.knowledgeMarkdown).not.toContain('Đại vận 10 năm')
    expect(ragContext.knowledgeMarkdown).toContain('Bản Mệnh & Cục:')
  })
})

describe('Yearly Horoscope (Lưu Niên Vận Hạn) & Temporal Anchoring', () => {
  it('correctly calculates Can Chi for any solar year', () => {
    expect(getCanChiOfYear(2024)).toBe('Giáp Thìn')
    expect(getCanChiOfYear(2025)).toBe('Ất Tỵ')
    expect(getCanChiOfYear(2026)).toBe('Bính Ngọ')
    expect(getCanChiOfYear(2027)).toBe('Đinh Mùi')
    expect(getCanChiOfYear(2030)).toBe('Canh Tuất')
  })

  it('populates horoscope on NormalizedAstrolabe with rich yearly details', () => {
    const sampleInput: AstrolabeInput = {
      name: 'Trần Văn Vận',
      gender: 'nam',
      calendarType: 'solar',
      year: 1995,
      month: 6,
      day: 15,
      hour: 8,
      minute: 0,
      viewingYear: 2026,
    }
    const astrolabe = createAstrolabe(sampleInput)

    expect(astrolabe.horoscope).toBeDefined()
    expect(astrolabe.horoscope?.year).toBe(2026)
    expect(astrolabe.horoscope?.canChi).toBe('Bính Ngọ')
    expect(astrolabe.horoscope?.mutagens.loc).toBe('Thiên Đồng')
    expect(astrolabe.horoscope?.mutagens.quyen).toBe('Thiên Cơ')
    expect(astrolabe.horoscope?.mutagens.khoa).toBe('Văn Xương')
    expect(astrolabe.horoscope?.mutagens.ky).toBe('Liêm Trinh')
    expect(astrolabe.horoscope?.palaceYearlyRoles).toHaveLength(12)

    // Verify presence of Lưu Quan Lộc and Lưu Mệnh
    const roles = astrolabe.horoscope?.palaceYearlyRoles.map(r => r.yearlyRole)
    expect(roles).toContain('Quan Lộc')
    expect(roles).toContain('Mệnh')
    expect(roles).toContain('Tài Bạch')
  })

  it('embeds viewingYear and Lưu Niên context in RAG output even when targetPalaceName is specified', () => {
    const sampleInput: AstrolabeInput = {
      name: 'Lê Thị Thu',
      gender: 'nu',
      calendarType: 'solar',
      year: 1998,
      month: 4,
      day: 10,
      hour: 14,
      viewingYear: 2026,
    }
    const astrolabe = createAstrolabe(sampleInput)

    // Full context
    const fullContext = retrieveAstrologyContext(astrolabe)
    expect(fullContext.knowledgeMarkdown).toContain('Năm 2026 (Năm Âm lịch **Bính Ngọ**)')
    expect(fullContext.knowledgeMarkdown).toContain('Cung Lưu Quan Lộc năm 2026')
    expect(fullContext.knowledgeMarkdown).toContain('Lưu Tứ Hóa năm 2026 (Bính Ngọ)')

    // Palace-focused context (e.g. user asks about Cung Quan Lộc)
    const palaceContext = retrieveAstrologyContext(astrolabe, 'Quan Lộc')
    expect(palaceContext.knowledgeMarkdown).toContain('CUNG QUAN LỘC')
    expect(palaceContext.knowledgeMarkdown).toContain('Năm 2026 (Năm Âm lịch **Bính Ngọ**)')
    expect(palaceContext.knowledgeMarkdown).toContain('Cung Lưu Quan Lộc năm 2026')
  })
})


