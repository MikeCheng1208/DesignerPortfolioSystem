// API 資料型別定義

/**
 * 個人資訊
 */
export interface Profile {
  name: string
  nameEn: string
  title: string
  bio: string[]
  philosophy: string
  photo?: string // 個人照片路徑 (可選)
  heroTitle?: string // 首頁主標語
  heroSubtitle?: string // 首頁副標語
}

/**
 * 作品卡片 (列表用)
 */
export interface ProjectCard {
  id: string
  title: string
  category: string
  year: string
  description: string
  tags: string[]
  color: string // 漸層色彩
  coverImage?: string // 封面圖片 URL
}

/**
 * 作品詳細資訊
 */
export interface ProjectDetail {
  id: string
  title: string
  category: string
  year: string
  description: string
  tags: string[]
  coverImage?: string   // 封面圖片 URL
  coverGradient: string // 封面漸層色（備用）

  // 專案概述
  overview: string
  client: string
  duration: string
  role: string
  tools: string

  // 挑戰與解決方案
  challenge: string
  solution: string

  // 圖片畫廊
  images: ProjectImage[]

  // 成果數據
  results: ProjectResult[]
}

/**
 * 專案圖片
 */
export interface ProjectImage {
  layout: 'full' | 'half'
  src?: string           // 圖片 URL
  gradient: string       // 漸層色（作為備用背景）
  label: string
  caption?: string
}

/**
 * 專案成果
 */
export interface ProjectResult {
  value: string
  label: string
}

/**
 * 技能分類
 */
export interface SkillCategory {
  id: string
  title: string
  skills: string[]
}

/**
 * 聯絡資訊
 */
export interface ContactLink {
  id: string
  label: string
  value: string
  url: string
}

/**
 * 完整的聯絡資訊
 */
export interface ContactInfo {
  text: string
  links: ContactLink[]
}

import type { ThemeConfig } from './database'

/**
 * 網站設定
 */
export interface SiteSettings {
  siteName: string
  siteTitle: string
  siteDescription: string
  siteAuthor: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  activeTheme?: string       // 當前啟用的主題 ID
  theme?: ThemeConfig        // 完整主題配置（由 API 根據 activeTheme 填充）
}
