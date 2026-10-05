export type Gender = 'nam' | 'nu'
export type CalendarType = 'solar' | 'lunar'

export type StarBrightness = 'Miếu' | 'Vượng' | 'Đắc' | 'Bình' | 'Hãm'
export type StarMutagen = 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ' | ''

export type StarType =
  | 'major'
  | 'soft'
  | 'tough'
  | 'lucun'
  | 'tianma'
  | 'flower'
  | 'helper'
  | 'adjective'

export interface AstrolabeInput {
  name: string
  gender: Gender
  calendarType: CalendarType
  year: number
  month: number
  day: number
  hour?: number
  minute?: number
  timeIndex?: number
  isLeapMonth?: boolean
  viewingYear?: number
}

export interface CanhGioInfo {
  index: number
  name: string
  branch: string
  timeRange: string
  description: string
}

export interface NormalizedStar {
  name: string
  type: StarType | string
  scope?: string
  brightness?: StarBrightness
  mutagen?: StarMutagen
}

export interface NormalizedPalace {
  index: number
  name: string
  isBodyPalace: boolean
  isOriginalPalace: boolean
  heavenlyStem: string
  earthlyBranch: string
  majorStars: NormalizedStar[]
  minorStars: NormalizedStar[]
  adjectiveStars: NormalizedStar[]
  changsheng12: string
  boshi12: string
  jiangqian12?: string
  suiqian12?: string
  decadal: {
    range: [number, number]
    heavenlyStem: string
    earthlyBranch: string
  }
  ages: number[]
}

export interface ThienBan {
  name: string
  gender: 'Nam' | 'Nữ'
  solarDate: string
  lunarDate: string
  lunarDateRaw: {
    lunarYear: number
    lunarMonth: number
    lunarDay: number
    isLeap: boolean
  }
  chineseDate: {
    year: string
    month: string
    day: string
    hour: string
    full: string
  }
  timeRange: string
  timeName: string
  fiveElementsClass: string
  soulStar: string
  bodyStar: string
  zodiac: string
  sign: string
  soulPalaceBranch: string
  bodyPalaceBranch: string
  viewingYear: number
}

export interface YearlyHoroscopeRole {
  palaceIndex: number
  originalPalaceName: string
  yearlyRole: string
  yearlyStars: string[]
}

export interface YearlyHoroscope {
  year: number
  canChi: string
  heavenlyStem: string
  earthlyBranch: string
  nominalAge: number
  yearlySoulPalace: {
    index: number
    originalPalaceName: string
    earthlyBranch: string
  }
  smallLimitPalace: {
    index: number
    originalPalaceName: string
    earthlyBranch: string
  }
  mutagens: {
    loc: string
    quyen: string
    khoa: string
    ky: string
  }
  palaceYearlyRoles: YearlyHoroscopeRole[]
}

export interface NormalizedAstrolabe {
  id: string
  thienBan: ThienBan
  palaces: NormalizedPalace[]
  patterns: string[]
  horoscope?: YearlyHoroscope
  createdAt: string
}

export interface SurroundingPalacesInfo {
  target: NormalizedPalace
  opposite: NormalizedPalace
  wealth: NormalizedPalace
  career: NormalizedPalace
}

export interface AstrologyContextResult {
  astrolabeId: string
  targetPalace?: string
  summary: string
  knowledgeMarkdown: string
  patterns: string[]
  palaceContexts: Record<string, string>
}

export interface AstrolabeCalculateResponse {
  astrolabe: NormalizedAstrolabe
}

export interface AiReportRequest {
  astrolabe: NormalizedAstrolabe
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: string
  targetPalaceName?: string
}

export interface AiChatRequest {
  astrolabe: NormalizedAstrolabe
  targetPalaceName?: string
  messages: Array<{
    role: 'user' | 'assistant' | 'system'
    content: string
  }>
}

