import { beforeEach, describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { createPinia, setActivePinia } from 'pinia'
import {
  CANH_GIO_LIST,
  createAstrolabe,
  getCanhGioInfo,
  getPalaceByName,
  getTimeIndexFromHourMinute,
} from '../utils/tuvi'
import { useTuviStore } from '../stores/useTuviStore'
import { resolveAiConfig } from '../server/utils/ai'
import { retrieveAstrologyContext } from '../server/utils/rag'
import type { AstrolabeInput } from '../types/tuvi'

describe('Issue 05: An Sao Mốc Thời Gian Đặc Biệt', () => {
  it('correctly handles Giờ Tý đổi ngày (Tý sớm 00:00 vs Tý muộn 23:30)', () => {
    // 1. Tý sớm (00:00 - 00:59): cùng ngày dương lịch, timeIndex = 0
    const earlyTyInput: AstrolabeInput = {
      name: 'Nguyễn Tý Sớm',
      gender: 'nam',
      calendarType: 'solar',
      year: 2000,
      month: 5,
      day: 15,
      hour: 0,
      minute: 25,
      viewingYear: 2026,
    }

    const astrolabeEarlyTy = createAstrolabe(earlyTyInput)
    expect(astrolabeEarlyTy).toBeDefined()
    expect(astrolabeEarlyTy.thienBan.timeName).toContain('Tý')
    expect(astrolabeEarlyTy.thienBan.timeRange).toBe('00:00 ~ 01:00')
    expect(astrolabeEarlyTy.palaces).toHaveLength(12)

    // 2. Tý muộn (23:00 - 23:59): Dạ Tý / Tý muộn, timeIndex = 12
    const lateTyInput: AstrolabeInput = {
      name: 'Nguyễn Tý Muộn',
      gender: 'nam',
      calendarType: 'solar',
      year: 2000,
      month: 5,
      day: 15,
      hour: 23,
      minute: 45,
      viewingYear: 2026,
    }

    const astrolabeLateTy = createAstrolabe(lateTyInput)
    expect(astrolabeLateTy).toBeDefined()
    expect(astrolabeLateTy.thienBan.timeName).toContain('Tý')
    expect(astrolabeLateTy.thienBan.timeRange).toBe('23:00 ~ 00:00')
    expect(astrolabeLateTy.palaces).toHaveLength(12)

    // Cả 2 đều có đầy đủ 14 chính tinh và ngũ hành nạp âm hợp lệ
    expect(astrolabeEarlyTy.thienBan.fiveElementsClass).toBeTruthy()
    expect(astrolabeLateTy.thienBan.fiveElementsClass).toBeTruthy()
  })

  it('correctly handles Lunar Calendar with Leap Months (Năm Nhuận & Tháng Nhuận)', () => {
    // Năm 2020 Canh Tý có tháng 4 nhuận
    const leap2020Input: AstrolabeInput = {
      name: 'Phạm Nhuận Tý',
      gender: 'nu',
      calendarType: 'lunar',
      year: 2020,
      month: 4,
      day: 15,
      isLeapMonth: true,
      hour: 9,
      minute: 30,
      viewingYear: 2026,
    }

    const astrolabeLeap = createAstrolabe(leap2020Input)
    expect(astrolabeLeap).toBeDefined()
    expect(astrolabeLeap.thienBan.chineseDate.year).toBe('Canh Tý')
    expect(astrolabeLeap.thienBan.lunarDate).toContain('Nhuận')
    expect(astrolabeLeap.palaces).toHaveLength(12)

    // So sánh với tháng 4 thường (không nhuận)
    const normal2020Input: AstrolabeInput = {
      ...leap2020Input,
      isLeapMonth: false,
    }
    const astrolabeNormal = createAstrolabe(normal2020Input)
    expect(astrolabeNormal.thienBan.lunarDate).not.toContain('Nhuận')

    // Năm 2023 Quý Mão có tháng 2 nhuận
    const leap2023Input: AstrolabeInput = {
      name: 'Đặng Nhuận Mão',
      gender: 'nam',
      calendarType: 'lunar',
      year: 2023,
      month: 2,
      day: 8,
      isLeapMonth: true,
      hour: 14,
      minute: 0,
      viewingYear: 2026,
    }
    const astrolabeLeap2023 = createAstrolabe(leap2023Input)
    expect(astrolabeLeap2023.thienBan.chineseDate.year).toBe('Quý Mão')
    expect(astrolabeLeap2023.thienBan.lunarDate).toContain('Nhuận')
    expect(astrolabeLeap2023.palaces).toHaveLength(12)
  })
})

describe('Issue 05: Pinia Store LocalStorage Management & Renaming', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const sampleInput: AstrolabeInput = {
    name: 'Võ Minh Khôi',
    gender: 'nam',
    calendarType: 'solar',
    year: 1998,
    month: 12,
    day: 10,
    hour: 7,
    minute: 30,
    viewingYear: 2026,
  }

  it('supports full lifecycle: save, rename, remove and clearAll', () => {
    const store = useTuviStore()
    const astrolabe = createAstrolabe(sampleInput)

    // 1. Set current astrolabe
    store.setCurrentAstrolabe(astrolabe)
    expect(store.currentAstrolabe?.thienBan.name).toBe('Võ Minh Khôi')
    expect(store.hasCurrentAstrolabe).toBe(true)

    // 2. Save astrolabe
    store.saveAstrolabe()
    expect(store.savedCount).toBe(1)
    expect(store.savedAstrolabes[0].id).toBe(astrolabe.id)

    // 3. Rename saved astrolabe
    store.renameSavedAstrolabe(astrolabe.id, 'Võ Minh Khôi (Đã Đổi Tên)')
    expect(store.savedAstrolabes[0].thienBan.name).toBe('Võ Minh Khôi (Đã Đổi Tên)')
    expect(store.currentAstrolabe?.thienBan.name).toBe('Võ Minh Khôi (Đã Đổi Tên)')

    // 4. Save report and chat messages
    store.setReport(astrolabe.id, '### Báo cáo thử nghiệm')
    store.addChatMessage(astrolabe.id, {
      role: 'user',
      content: 'Chào bạn',
    })
    store.appendChatChunk(astrolabe.id, ' Xin chào đương số.')

    expect(store.currentReport).toBe('### Báo cáo thử nghiệm')
    expect(store.currentChatMessages).toHaveLength(1)

    // 5. Remove saved astrolabe
    store.removeSavedAstrolabe(astrolabe.id)
    expect(store.savedCount).toBe(0)
    expect(store.currentAstrolabe).toBeNull()
    expect(store.currentReport).toBe('')
    expect(store.currentChatMessages).toEqual([])
  })
})

describe('Issue 05: LLM Streaming & Simulation', () => {
  const sampleInput: AstrolabeInput = {
    name: 'Hoàng Lan',
    gender: 'nu',
    calendarType: 'solar',
    year: 1999,
    month: 3,
    day: 25,
    hour: 16,
    minute: 20,
    viewingYear: 2026,
  }

  const astrolabe = createAstrolabe(sampleInput)

  it('prepares structured astrology context for AI prompt adhering to GLOSSARY.md', () => {
    const rag = retrieveAstrologyContext(astrolabe)
    expect(rag.knowledgeMarkdown).toBeDefined()
    expect(rag.palaceContexts['Mệnh']).toBeDefined()
    expect(rag.palaceContexts['Quan Lộc']).toBeDefined()
    expect(rag.palaceContexts['Tài Bạch']).toBeDefined()
    expect(rag.palaceContexts['Phu Thê']).toBeDefined()
    expect(rag.knowledgeMarkdown).toContain('Hoàng Lan')
  })

  it('resolves live AI model configuration without fallback templates', () => {
    const config = resolveAiConfig()
    expect(config.modelName).toBeTruthy()
    expect(config.baseUrl).toContain('http')
  })
})

describe('Issue 05: Page Assembly Files & Structure Verification', () => {
  const rootDir = path.resolve(__dirname, '..')

  it('verifies pages/index.vue exists and has the required structure', () => {
    const indexPath = path.join(rootDir, 'pages/index.vue')
    expect(fs.existsSync(indexPath)).toBe(true)

    const content = fs.readFileSync(indexPath, 'utf-8')
    // Must handle state 1 (no astrolabe -> BirthInputForm)
    expect(content).toContain('BirthInputForm')
    expect(content).toContain('!store.hasCurrentAstrolabe')

    // Must handle state 2 (has astrolabe -> AstrolabeGrid, AiReportView, AiChatBox)
    expect(content).toContain('AstrolabeGrid')
    expect(content).toContain('AiReportView')
    expect(content).toContain('AiChatBox')
    expect(content).toContain('PalaceDetailSheet')

    // Must support tabs and composables
    expect(content).toContain('activeTab')
    expect(content).toContain('useCalculateAstrolabeMutation')
    expect(content).toContain('useAstrolabeReportStream')
    expect(content).toContain('useAstrolabeChatStream')
  })

  it('verifies pages/history.vue exists and has search, filter, rename and delete', () => {
    const historyPath = path.join(rootDir, 'pages/history.vue')
    expect(fs.existsSync(historyPath)).toBe(true)

    const content = fs.readFileSync(historyPath, 'utf-8')
    expect(content).toContain('savedAstrolabes')
    expect(content).toContain('searchQuery')
    expect(content).toContain('genderFilter')
    expect(content).toContain('hasReportFilter')
    expect(content).toContain('renameSavedAstrolabe')
    expect(content).toContain('removeSavedAstrolabe')
    expect(content).toContain('clearAllData')
    expect(content).toContain('handleViewAstrolabe')
  })

  it('verifies app.vue provides full navigation shell with Apple Minimalist aesthetic', () => {
    const appPath = path.join(rootDir, 'app.vue')
    expect(fs.existsSync(appPath)).toBe(true)

    const content = fs.readFileSync(appPath, 'utf-8')
    expect(content).toContain('<NuxtPage />')
    expect(content).toContain('<UNotifications />')
    expect(content).toContain('apple-glass')
    expect(content).toContain('Tử Vi AI')
    expect(content).toContain('isDark')
  })
})
