import { ObjectId } from 'mongodb'

/**
 * MongoDB 資料庫型別定義
 * 所有 Collection 的 Document 介面
 */

// ==================== 通用型別 ====================

/**
 * MongoDB Document 基礎型別
 */
export interface BaseDocument {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
}

// ==================== Profile Collection ====================

/**
 * Profile Document (個人資訊)
 * Collection: profile
 */
export interface ProfileDocument extends BaseDocument {
  name: string
  nameEn: string
  title: string
  bio: string[]
  philosophy: string
  photo?: string
  heroTitle?: string  // 首頁主標語
  heroSubtitle?: string  // 首頁副標語
  isActive: boolean  // 是否啟用（預留多人支援）
}

// ==================== Projects Collection ====================

/**
 * Project Image 結構
 */
export interface ProjectImageSchema {
  layout: 'full' | 'half'
  src?: string           // 圖片 URL
  gradient: string       // 漸層色（作為備用背景或載入中顯示）
  label: string
  caption?: string
  order: number  // 排序順序
}

/**
 * Project Result 結構
 */
export interface ProjectResultSchema {
  value: string
  label: string
  order: number  // 排序順序
}

/**
 * Project Document (作品)
 * Collection: projects
 */
export interface ProjectDocument extends BaseDocument {
  projectId: string  // URL 友善的 ID (例如: fintech-app)
  title: string
  category: string
  year: string
  description: string
  tags: string[]
  color: string  // 卡片漸層色
  coverImage?: string  // 封面圖片 URL
  coverGradient: string  // 封面漸層色（作為備用）

  // 專案詳細資訊
  overview: string
  client: string
  duration: string
  role: string
  tools: string

  // 挑戰與解決方案
  challenge: string
  solution: string

  // 圖片畫廊
  images: ProjectImageSchema[]

  // 成果數據
  results: ProjectResultSchema[]

  // 狀態
  published: boolean  // 是否發布
  featured: boolean   // 是否精選
  order: number       // 顯示順序

  // SEO
  slug: string        // URL slug
  metaDescription?: string
  metaKeywords?: string[]
}

// ==================== Skills Collection ====================

/**
 * Skill Category Document (技能分類)
 * Collection: skills
 */
export interface SkillCategoryDocument extends BaseDocument {
  categoryId: string  // 分類 ID (例如: design-expertise)
  title: string       // 分類標題
  skills: string[]    // 技能列表
  order: number       // 顯示順序
  isVisible: boolean  // 是否顯示
}

// ==================== Contact Collection ====================

/**
 * Contact Link 結構
 */
export interface ContactLinkSchema {
  id: string        // 連結 ID (例如: email, linkedin)
  label: string     // 顯示標籤
  value: string     // 顯示的值
  url: string       // 實際連結
  icon?: string     // 圖示名稱（可選）
  order: number     // 排序順序
}

/**
 * Contact Document (聯絡資訊)
 * Collection: contact
 * 注意：這個 collection 通常只有一筆資料
 */
export interface ContactDocument extends BaseDocument {
  text: string                  // 聯絡說明文字
  links: ContactLinkSchema[]    // 聯絡連結列表
  isActive: boolean             // 是否啟用
}

// ==================== Admin Users Collection ====================

/**
 * Admin User Role 型別
 */
export type AdminRole = 'super_admin' | 'admin' | 'editor'

/**
 * Admin User Document (後台使用者)
 * Collection: admin_users
 */
export interface AdminUserDocument extends BaseDocument {
  username: string              // 登入帳號 (unique)
  email: string                 // Email (unique)
  passwordHash: string          // bcrypt 加密的密碼
  displayName: string           // 顯示名稱
  role: AdminRole               // 角色
  permissions: string[]         // 權限列表
  isActive: boolean             // 帳號狀態
  lastLoginAt?: Date            // 最後登入時間
  loginAttempts: number         // 登入失敗次數
  lockedUntil?: Date            // 帳號鎖定至
  avatar?: string               // 頭像 URL
  preferences?: Record<string, any>  // 使用者偏好設定
  createdBy?: string            // 建立者
  updatedBy?: string            // 更新者
}

/**
 * Admin User Response (不包含敏感資訊)
 */
export interface AdminUserResponse {
  _id: string
  username: string
  email: string
  displayName: string
  role: AdminRole
  permissions: string[]
  isActive: boolean
  lastLoginAt?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// ==================== Site Settings Collection ====================

/**
 * Site Settings Document (網站設定)
 * Collection: site_settings
 * 注意：這個 collection 通常只有一筆資料
 */
export interface SiteSettingsDocument extends BaseDocument {
  siteName: string           // 網站名稱（用於 logo、footer 等）
  siteTitle: string          // 網站標題（用於 SEO title）
  siteDescription: string    // 網站描述（用於 SEO description）
  siteAuthor: string         // 網站作者（用於 meta author）
  ogTitle?: string           // Open Graph 標題
  ogDescription?: string     // Open Graph 描述
  ogImage?: string           // Open Graph 圖片
  isActive: boolean          // 是否啟用
}

/**
 * Site Settings Response (API 回傳格式)
 */
export interface SiteSettingsResponse {
  siteName: string
  siteTitle: string
  siteDescription: string
  siteAuthor: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

// ==================== Collection 名稱常數 ====================

export const COLLECTIONS = {
  PROFILE: 'profile',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  CONTACT: 'contact',
  ADMIN_USERS: 'admin_users',
  SITE_SETTINGS: 'site_settings',
} as const

// ==================== 索引定義 ====================

export interface IndexDefinition {
  collection: string
  key: Record<string, 1 | -1>
  options?: {
    unique?: boolean
    sparse?: boolean
    name?: string
  }
}

export const DATABASE_INDEXES: IndexDefinition[] = [
  // Profile 索引
  {
    collection: COLLECTIONS.PROFILE,
    key: { isActive: 1 },
    options: { name: 'idx_profile_isActive' }
  },

  // Projects 索引
  {
    collection: COLLECTIONS.PROJECTS,
    key: { projectId: 1 },
    options: { unique: true, name: 'idx_projects_projectId' }
  },
  {
    collection: COLLECTIONS.PROJECTS,
    key: { slug: 1 },
    options: { unique: true, name: 'idx_projects_slug' }
  },
  {
    collection: COLLECTIONS.PROJECTS,
    key: { published: 1, order: 1 },
    options: { name: 'idx_projects_published_order' }
  },
  {
    collection: COLLECTIONS.PROJECTS,
    key: { featured: 1, published: 1 },
    options: { name: 'idx_projects_featured_published' }
  },
  {
    collection: COLLECTIONS.PROJECTS,
    key: { tags: 1 },
    options: { name: 'idx_projects_tags' }
  },
  {
    collection: COLLECTIONS.PROJECTS,
    key: { category: 1 },
    options: { name: 'idx_projects_category' }
  },

  // Skills 索引
  {
    collection: COLLECTIONS.SKILLS,
    key: { categoryId: 1 },
    options: { unique: true, name: 'idx_skills_categoryId' }
  },
  {
    collection: COLLECTIONS.SKILLS,
    key: { order: 1, isVisible: 1 },
    options: { name: 'idx_skills_order_visible' }
  },

  // Contact 索引
  {
    collection: COLLECTIONS.CONTACT,
    key: { isActive: 1 },
    options: { name: 'idx_contact_isActive' }
  },

  // Admin Users 索引
  {
    collection: COLLECTIONS.ADMIN_USERS,
    key: { username: 1 },
    options: { unique: true, name: 'idx_admin_users_username' }
  },
  {
    collection: COLLECTIONS.ADMIN_USERS,
    key: { email: 1 },
    options: { unique: true, name: 'idx_admin_users_email' }
  },
  {
    collection: COLLECTIONS.ADMIN_USERS,
    key: { isActive: 1, role: 1 },
    options: { name: 'idx_admin_users_active_role' }
  },

  // Site Settings 索引
  {
    collection: COLLECTIONS.SITE_SETTINGS,
    key: { isActive: 1 },
    options: { name: 'idx_site_settings_isActive' }
  }
]
