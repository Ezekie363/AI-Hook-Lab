export type Platform = '小红书' | '抖音' | 'B站' | 'YouTube' | 'X'
export type ContentType = '视频' | '图文' | '产品广告' | '教程' | '观点贴'

export interface Hook {
  id: string
  content: string
  style: string
  score: number       // 1–10
  reason: string
  isFavorite: boolean
}

export interface HistoryEntry {
  id: string
  topic: string
  platform: Platform
  contentType: ContentType
  hooks: Hook[]
  createdAt: string   // ISO 8601
}

export const PLATFORMS: Platform[] = ['小红书', '抖音', 'B站', 'YouTube', 'X']
export const CONTENT_TYPES: ContentType[] = ['视频', '图文', '产品广告', '教程', '观点贴']

export const PRESET_STYLES = [
  '悬念式',
  '数据冲击式',
  '故事式',
  '共鸣式',
  '反常识式',
  '干货承诺式',
  '痛点直击式',
  '对话式',
] as const
