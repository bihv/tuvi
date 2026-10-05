import { describe, expect, it } from 'vitest'
import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import { CANH_GIO_LIST, createAstrolabe, getSurroundingPalaces } from '../utils/tuvi'

describe('Issue 04 UI Components Verification', () => {
  const componentsDir = path.resolve(__dirname, '../components')

  it('verifies all 6 required Issue 04 components exist and are non-empty', () => {
    const requiredComponents = [
      'BirthInputForm.vue',
      'ThienBanCard.vue',
      'AstrolabeGrid.vue',
      'PalaceCell.vue',
      'PalaceDetailSheet.vue',
      'AiReportView.vue',
      'AiChatBox.vue',
    ]

    for (const compName of requiredComponents) {
      const fullPath = path.join(componentsDir, compName)
      expect(fs.existsSync(fullPath), `Component ${compName} should exist`).toBe(true)
      const content = fs.readFileSync(fullPath, 'utf-8')
      expect(content.length).toBeGreaterThan(100)
      expect(content).toContain('<template>')
      expect(content).toContain('<script setup lang="ts">')
    }
  })

  it('BirthInputForm has all required input fields and controls', () => {
    const content = fs.readFileSync(path.join(componentsDir, 'BirthInputForm.vue'), 'utf-8')
    expect(content).toContain('calendarOptions')
    expect(content).toContain('CANH_GIO_LIST')
    expect(content).toContain('isLeapMonth')
    expect(content).toContain('viewingYear')
    expect(content).toContain('timeMode')
  })

  it('ThienBanCard contains Apple Wallet aesthetic and all core spec fields', () => {
    const content = fs.readFileSync(path.join(componentsDir, 'ThienBanCard.vue'), 'utf-8')
    expect(content).toContain('apple-glass')
    expect(content).toContain('fiveElementsClass')
    expect(content).toContain('soulStar')
    expect(content).toContain('bodyStar')
    expect(content).toContain('soulPalaceBranch')
    expect(content).toContain('bodyPalaceBranch')
    expect(content).toContain('patterns')
    expect(content).toContain('generateReport')
  })

  it('AstrolabeGrid maps the 12 Earthly Branches to a 4x4 matrix and supports mobile modes', () => {
    const content = fs.readFileSync(path.join(componentsDir, 'AstrolabeGrid.vue'), 'utf-8')
    expect(content).toContain('mobileViewMode')
    expect(content).toContain('BRANCH_GRID_COORDINATES')
    expect(content).toContain('getGridStyle')
    expect(content).not.toContain('Feed Dọc')
    expect(content).not.toContain('Mini-Grid')
    expect(content).not.toContain('Trọng điểm')
    expect(content).toContain('carouselContainer')
    expect(content).toContain('Vuốt ngang các cung')
  })

  it('PalaceDetailSheet integrates Bottom Sheet for mobile and Drawer for desktop', () => {
    const content = fs.readFileSync(path.join(componentsDir, 'PalaceDetailSheet.vue'), 'utf-8')
    expect(content).toContain('activeTab')
    expect(content).toContain('getSurroundingPalaces')
    expect(content).toContain('suggestedPrompts')
    expect(content).toContain('Cung Xung Chiếu')
    expect(content).toContain('Cung Tam Hợp')
  })

  it('AiReportView uses marked to render markdown, supports internal scrolling, copy and regenerate', () => {
    const content = fs.readFileSync(path.join(componentsDir, 'AiReportView.vue'), 'utf-8')
    expect(content).toContain('marked')
    expect(content).toContain('renderedHtml')
    expect(content).toContain('copyReport')
    expect(content).toContain('regenerate')
    expect(content).toContain('overflow-y-auto')
    expect(content).toContain('h-full')
  })

  it('AiChatBox handles free-form Q&A with message history, palace focus, and streaming', () => {
    const content = fs.readFileSync(path.join(componentsDir, 'AiChatBox.vue'), 'utf-8')
    expect(content).toContain('quickSuggestions')
    expect(content).toContain('targetPalaceName')
    expect(content).toContain('isStreaming')
    expect(content).toContain('renderMessageHtml')
    expect(content).toContain('h-full')
  })

  it('marked parses complex markdown structure reliably', () => {
    const markdown = `
### 1. Tổng quan Bản Mệnh
Đương số có mệnh **Tử Vi Cư Ngọ**, tính tình cương trực, có tài lãnh đạo.

> Lời khuyên: Cần lắng nghe cộng sự để củng cố uy tín.
    `
    const html = marked(markdown) as string
    expect(html).toContain('<h3>1. Tổng quan Bản Mệnh</h3>')
    expect(html).toContain('<strong>Tử Vi Cư Ngọ</strong>')
    expect(html).toContain('<blockquote>')
  })

  it('verifies 4x4 surrounding palaces calculation integrity', () => {
    const astrolabe = createAstrolabe({
      name: 'Test Đương Số',
      gender: 'nam',
      calendarType: 'solar',
      year: 1990,
      month: 5,
      day: 20,
      hour: 6,
    })

    const menhPalace = astrolabe.palaces.find(p => p.name === 'Mệnh')!
    const surrounding = getSurroundingPalaces(astrolabe, menhPalace.name)

    expect(surrounding).toBeDefined()
    expect(surrounding?.target.name).toBe('Mệnh')
    expect(surrounding?.opposite).toBeDefined()
    expect(surrounding?.wealth).toBeDefined()
    expect(surrounding?.career).toBeDefined()
  })
})
