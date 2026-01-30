import type { ObjectId } from 'mongodb'

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

// ==================== 主題設定 ====================

/**
 * Hero 區域佈局類型
 */
export type HeroStyle = 'centered' | 'left-aligned' | 'fullscreen'

/**
 * Hero 標題大小
 */
export type HeroTitleSize = 'normal' | 'large' | 'xlarge'

/**
 * 作品展示佈局類型
 */
export type ProjectsLayout = 'grid' | 'list'

/**
 * 卡片樣式類型
 */
export type CardStyle = 'elevated' | 'flat' | 'outlined' | 'glowing'

/**
 * 導航樣式類型
 */
export type NavStyle = 'top-blur' | 'top-solid' | 'top-minimal' | 'side'

/**
 * 區段間距類型
 */
export type SectionSpacing = 'compact' | 'normal' | 'spacious'

/**
 * 卡片 hover 動畫類型
 */
export type CardHoverAnimation = 'lift' | 'glow' | 'scale' | 'none'

/**
 * 動畫速度類型
 */
export type AnimationDuration = 'fast' | 'normal' | 'slow'

/**
 * 主題配置介面
 */
export interface ThemeConfig {
  id: string              // 主題 ID
  name: string            // 主題名稱
  description: string     // 主題描述
  colors: {
    bg: string            // 主背景色
    bgSecondary: string   // 次要背景色
    text: string          // 主要文字色
    textMuted: string     // 次要文字色
    accent: string        // 強調色
    accentHover: string   // 強調色 hover 狀態
    border: string        // 邊框色
  }
  fonts: {
    display: string       // 標題字體
    body: string          // 內文字體
  }
  effects: {
    borderRadiusButton: string   // 按鈕圓角
    borderRadiusCard: string     // 卡片圓角
    shadowCard: string           // 卡片陰影
    navBlur: string              // 導航列毛玻璃效果
    navBgOpacity: number         // 導航列背景透明度
  }
  // 排版系統
  layout: {
    heroStyle: HeroStyle              // Hero 區域佈局
    heroTitleSize: HeroTitleSize      // Hero 標題大小
    projectsLayout: ProjectsLayout    // 作品展示佈局
    projectsColumns: 1 | 2 | 3        // 作品欄數
    cardStyle: CardStyle              // 卡片樣式
    navStyle: NavStyle                // 導航樣式
    sectionSpacing: SectionSpacing    // 區段間距
  }
  // 動畫系統
  animations: {
    cardHover: CardHoverAnimation     // 卡片 hover 動畫
    duration: AnimationDuration       // 動畫速度
  }
}

/**
 * 預設主題配置
 */
export const DEFAULT_THEMES: ThemeConfig[] = [
  // 1. 經典優雅 (Classic Elegant)
  {
    id: 'classic',
    name: '經典優雅',
    description: '溫暖的色調搭配圓潤的設計元素，適合專業的個人品牌',
    colors: {
      bg: '#fafaf9',
      bgSecondary: '#ffffff',
      text: '#1a1a1a',
      textMuted: '#737373',
      accent: '#1e40af',
      accentHover: '#1e3a8a',
      border: '#e5e5e5'
    },
    fonts: {
      display: '"Playfair Display", Georgia, serif',
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    },
    effects: {
      borderRadiusButton: '100px',
      borderRadiusCard: '12px',
      shadowCard: '0 20px 40px rgba(0, 0, 0, 0.1)',
      navBlur: 'blur(20px)',
      navBgOpacity: 0.8
    },
    layout: {
      heroStyle: 'centered',
      heroTitleSize: 'normal',
      projectsLayout: 'grid',
      projectsColumns: 2,
      cardStyle: 'elevated',
      navStyle: 'top-blur',
      sectionSpacing: 'normal'
    },
    animations: {
      cardHover: 'lift',
      duration: 'normal'
    }
  },
  // 2. 現代極簡 (Modern Minimal)
  {
    id: 'minimal',
    name: '現代極簡',
    description: '純白背景搭配簡約黑色設計，強調內容本身',
    colors: {
      bg: '#ffffff',
      bgSecondary: '#fafafa',
      text: '#000000',
      textMuted: '#525252',
      accent: '#000000',
      accentHover: '#262626',
      border: '#e5e5e5'
    },
    fonts: {
      display: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
    },
    effects: {
      borderRadiusButton: '0px',
      borderRadiusCard: '0px',
      shadowCard: 'none',
      navBlur: 'none',
      navBgOpacity: 1
    },
    layout: {
      heroStyle: 'left-aligned',
      heroTitleSize: 'xlarge',
      projectsLayout: 'list',
      projectsColumns: 1,
      cardStyle: 'flat',
      navStyle: 'top-minimal',
      sectionSpacing: 'spacious'
    },
    animations: {
      cardHover: 'none',
      duration: 'fast'
    }
  },
  // 3. 創意大膽 (Creative Bold)
  {
    id: 'creative',
    name: '創意大膽',
    description: '活潑的橘紅色搭配不規則設計，展現創意個性',
    colors: {
      bg: '#f5f5f5',
      bgSecondary: '#ffffff',
      text: '#1a1a1a',
      textMuted: '#525252',
      accent: '#ff6b35',
      accentHover: '#e85a2a',
      border: '#e0e0e0'
    },
    fonts: {
      display: '"Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif'
    },
    effects: {
      borderRadiusButton: '0px',
      borderRadiusCard: '24px',
      shadowCard: '8px 8px 0 rgba(255, 107, 53, 0.3)',
      navBlur: 'none',
      navBgOpacity: 1
    },
    layout: {
      heroStyle: 'fullscreen',
      heroTitleSize: 'xlarge',
      projectsLayout: 'grid',
      projectsColumns: 3,
      cardStyle: 'elevated',
      navStyle: 'side',
      sectionSpacing: 'compact'
    },
    animations: {
      cardHover: 'scale',
      duration: 'fast'
    }
  },
  // 4. 日系清新 (Japanese Soft)
  {
    id: 'japanese',
    name: '日系清新',
    description: '大量留白搭配柔和粉色，營造溫柔細膩的氛圍',
    colors: {
      bg: '#fffef5',
      bgSecondary: '#ffffff',
      text: '#2d2d2d',
      textMuted: '#7a7a7a',
      accent: '#e8a4a0',
      accentHover: '#d98f8b',
      border: '#f0ebe0'
    },
    fonts: {
      display: '"Noto Sans TC", -apple-system, BlinkMacSystemFont, sans-serif',
      body: '"Noto Sans TC", -apple-system, BlinkMacSystemFont, sans-serif'
    },
    effects: {
      borderRadiusButton: '6px',
      borderRadiusCard: '6px',
      shadowCard: '0 4px 20px rgba(0, 0, 0, 0.04)',
      navBlur: 'blur(10px)',
      navBgOpacity: 0.9
    },
    layout: {
      heroStyle: 'centered',
      heroTitleSize: 'normal',
      projectsLayout: 'grid',
      projectsColumns: 2,
      cardStyle: 'flat',
      navStyle: 'top-solid',
      sectionSpacing: 'spacious'
    },
    animations: {
      cardHover: 'lift',
      duration: 'slow'
    }
  },
  // 5. 科技未來 (Tech Future)
  {
    id: 'tech',
    name: '科技未來',
    description: '深黑背景搭配霓虹綠，展現科技感與現代風格',
    colors: {
      bg: '#0a0a0a',
      bgSecondary: '#141414',
      text: '#fafafa',
      textMuted: '#a3a3a3',
      accent: '#00ff88',
      accentHover: '#00cc6a',
      border: '#262626'
    },
    fonts: {
      display: '"JetBrains Mono", ui-monospace, monospace',
      body: '"JetBrains Mono", ui-monospace, monospace'
    },
    effects: {
      borderRadiusButton: '4px',
      borderRadiusCard: '4px',
      shadowCard: '0 0 30px rgba(0, 255, 136, 0.15)',
      navBlur: 'blur(12px)',
      navBgOpacity: 0.85
    },
    layout: {
      heroStyle: 'fullscreen',
      heroTitleSize: 'large',
      projectsLayout: 'grid',
      projectsColumns: 3,
      cardStyle: 'glowing',
      navStyle: 'side',
      sectionSpacing: 'normal'
    },
    animations: {
      cardHover: 'glow',
      duration: 'fast'
    }
  },
  // 6. 野獸派 (Brutal)
  {
    id: 'brutal',
    name: '野獸派',
    description: '高對比黑黃配色、粗暴排版、故障藝術特效，極具視覺衝擊力',
    colors: {
      bg: '#0a0a0a',
      bgSecondary: '#141414',
      text: '#ffffff',
      textMuted: '#999999',
      accent: '#ffff00',
      accentHover: '#cccc00',
      border: '#333333'
    },
    fonts: {
      display: '"Arial Black", "Helvetica Neue", sans-serif',
      body: '"Helvetica Neue", Arial, sans-serif'
    },
    effects: {
      borderRadiusButton: '0px',
      borderRadiusCard: '0px',
      shadowCard: 'none',
      navBlur: 'none',
      navBgOpacity: 0
    },
    layout: {
      heroStyle: 'fullscreen',
      heroTitleSize: 'xlarge',
      projectsLayout: 'grid',
      projectsColumns: 2,
      cardStyle: 'flat',
      navStyle: 'top-minimal',
      sectionSpacing: 'spacious'
    },
    animations: {
      cardHover: 'none',
      duration: 'fast'
    }
  }
]

/**
 * 根據 ID 取得主題配置
 */
export function getThemeById(themeId: string): ThemeConfig {
  return DEFAULT_THEMES.find(t => t.id === themeId) || DEFAULT_THEMES[0]
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
  activeTheme?: string       // 當前啟用的主題 ID（預設為 'classic'）
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
