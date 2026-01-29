/**
 * Nitro 插件：應用啟動時自動建立初始資料
 * 包含 profile、skills、contact、示範 project
 * 只在資料不存在時執行
 */

import { getCollection } from '../utils/db'

// ==================== 型別定義 ====================

interface ProfileDocument {
  name: string
  nameEn: string
  title: string
  bio: string[]
  philosophy: string
  photo?: string
  heroTitle?: string
  heroSubtitle?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface SkillCategoryDocument {
  categoryId: string
  title: string
  skills: string[]
  order: number
  isVisible: boolean
  createdAt: Date
  updatedAt: Date
}

interface ContactLinkSchema {
  id: string
  label: string
  value: string
  url: string
  icon?: string
  order: number
}

interface ContactDocument {
  text: string
  links: ContactLinkSchema[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface ProjectImageSchema {
  layout: 'full' | 'half'
  src?: string
  gradient: string
  label: string
  caption?: string
  order: number
}

interface ProjectResultSchema {
  value: string
  label: string
  order: number
}

interface ProjectDocument {
  projectId: string
  title: string
  category: string
  year: string
  description: string
  tags: string[]
  color: string
  coverImage?: string
  coverGradient: string
  overview: string
  client: string
  duration: string
  role: string
  tools: string
  challenge: string
  solution: string
  images: ProjectImageSchema[]
  results: ProjectResultSchema[]
  published: boolean
  featured: boolean
  order: number
  slug: string
  createdAt: Date
  updatedAt: Date
}

interface SiteSettingsDocument {
  siteName: string
  siteTitle: string
  siteDescription: string
  siteAuthor: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ==================== 初始化函數 ====================

/**
 * 初始化 Profile 資料
 */
async function initProfile() {
  const collection = await getCollection<ProfileDocument>('profile')
  const existing = await collection.findOne({ isActive: true })

  if (existing) {
    console.log('  ✓ Profile 資料已存在')
    return
  }

  const now = new Date()
  // 注意：這裡的預設值應與 site_settings 中的 siteName 保持一致
  // 若需更改名字，請同時更新 site_settings
  const profile: ProfileDocument = {
    name: '您的名字',
    nameEn: 'Your Name',
    title: 'UI/UX 設計師',
    bio: [
      '你好！我是一位熱愛設計的 UI/UX 設計師。',
      '專注於創造直覺且美觀的使用者體驗，善於將複雜的需求轉化為簡潔的設計解決方案。'
    ],
    philosophy: '透過設計解決問題，創造價值。好的設計不只是美觀，更要能真正幫助使用者達成目標。',
    photo: '',
    heroTitle: '設計創造價值',
    heroSubtitle: '專注於使用者體驗設計與介面創新',
    isActive: true,
    createdAt: now,
    updatedAt: now
  }

  await collection.insertOne(profile)
  await collection.createIndex({ isActive: 1 }).catch(() => {})
  console.log('  ✓ Profile 資料建立成功')
}

/**
 * 初始化 Skills 資料
 */
async function initSkills() {
  const collection = await getCollection<SkillCategoryDocument>('skills')
  const existing = await collection.findOne({})

  if (existing) {
    console.log('  ✓ Skills 資料已存在')
    return
  }

  const now = new Date()
  const skills: SkillCategoryDocument[] = [
    {
      categoryId: 'design-expertise',
      title: '設計專業',
      skills: ['UI Design', 'UX Design', 'Interaction Design', 'Visual Design', 'Design System'],
      order: 1,
      isVisible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      categoryId: 'design-tools',
      title: '設計工具',
      skills: ['Figma', 'Sketch', 'Adobe XD', 'Adobe Photoshop', 'Adobe Illustrator'],
      order: 2,
      isVisible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      categoryId: 'prototyping',
      title: '原型與互動',
      skills: ['Prototyping', 'Wireframing', 'User Flow', 'Information Architecture'],
      order: 3,
      isVisible: true,
      createdAt: now,
      updatedAt: now
    },
    {
      categoryId: 'research',
      title: '使用者研究',
      skills: ['User Research', 'Usability Testing', 'A/B Testing', 'Data Analysis'],
      order: 4,
      isVisible: true,
      createdAt: now,
      updatedAt: now
    }
  ]

  await collection.insertMany(skills)
  await collection.createIndex({ categoryId: 1 }, { unique: true }).catch(() => {})
  await collection.createIndex({ order: 1, isVisible: 1 }).catch(() => {})
  console.log('  ✓ Skills 資料建立成功 (4 個分類)')
}

/**
 * 初始化 Contact 資料
 */
async function initContact() {
  const collection = await getCollection<ContactDocument>('contact')
  const existing = await collection.findOne({ isActive: true })

  if (existing) {
    console.log('  ✓ Contact 資料已存在')
    return
  }

  const now = new Date()
  const contact: ContactDocument = {
    text: '如果您對我的作品有興趣，或是有任何合作機會，歡迎透過以下方式聯絡我。',
    links: [
      {
        id: 'email',
        label: 'Email',
        value: 'hello@example.com',
        url: 'mailto:hello@example.com',
        icon: 'i-heroicons-envelope',
        order: 1
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        value: 'linkedin.com/in/example',
        url: 'https://linkedin.com/in/example',
        icon: 'i-simple-icons-linkedin',
        order: 2
      },
      {
        id: 'behance',
        label: 'Behance',
        value: 'behance.net/example',
        url: 'https://behance.net/example',
        icon: 'i-simple-icons-behance',
        order: 3
      }
    ],
    isActive: true,
    createdAt: now,
    updatedAt: now
  }

  await collection.insertOne(contact)
  await collection.createIndex({ isActive: 1 }).catch(() => {})
  console.log('  ✓ Contact 資料建立成功')
}

/**
 * 初始化示範 Project 資料
 */
async function initDemoProject() {
  const collection = await getCollection<ProjectDocument>('projects')
  const existing = await collection.findOne({})

  if (existing) {
    console.log('  ✓ Projects 資料已存在')
    return
  }

  const now = new Date()
  const demoProject: ProjectDocument = {
    projectId: 'demo-project',
    title: '示範作品 - 請在後台編輯或刪除',
    category: 'UI/UX Design',
    year: new Date().getFullYear().toString(),
    description: '這是一個示範作品，您可以在後台編輯或刪除它，並新增您自己的作品。',
    tags: ['UI Design', 'UX Design', 'Mobile App'],
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    coverImage: 'https://picsum.photos/800/500?random=cover',
    coverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    overview: '這是一個示範作品的概述。在這裡描述您的專案背景、目標和整體規劃。',
    client: '示範客戶',
    duration: '2 個月',
    role: 'UI/UX Designer',
    tools: 'Figma, Adobe Photoshop',
    challenge: '描述您在這個專案中遇到的主要挑戰和問題。',
    solution: '描述您如何解決這些挑戰，採用了什麼方法和策略。',
    images: [
      {
        layout: 'full',
        src: 'https://picsum.photos/1600/1000?random=1',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        label: '主視覺設計',
        caption: '這是作品的主要視覺呈現，展示整體設計風格。',
        order: 1
      },
      {
        layout: 'half',
        src: 'https://picsum.photos/800/500?random=2',
        gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        label: '使用者介面',
        caption: '應用程式的主要介面設計。',
        order: 2
      },
      {
        layout: 'half',
        src: 'https://picsum.photos/800/500?random=3',
        gradient: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',
        label: '互動流程',
        caption: '使用者操作流程的設計展示。',
        order: 3
      },
      {
        layout: 'full',
        src: 'https://picsum.photos/1600/1000?random=4',
        gradient: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)',
        label: '設計系統',
        caption: '專案使用的設計系統與元件庫。',
        order: 4
      }
    ],
    results: [
      { value: '+50%', label: '使用者滿意度', order: 1 },
      { value: '-30%', label: '跳出率', order: 2 },
      { value: '+25%', label: '轉換率提升', order: 3 }
    ],
    published: false, // 預設不發布
    featured: false,
    order: 1,
    slug: 'demo-project',
    createdAt: now,
    updatedAt: now
  }

  await collection.insertOne(demoProject)
  await collection.createIndex({ projectId: 1 }, { unique: true }).catch(() => {})
  await collection.createIndex({ slug: 1 }, { unique: true }).catch(() => {})
  await collection.createIndex({ published: 1, order: 1 }).catch(() => {})
  await collection.createIndex({ featured: 1, published: 1 }).catch(() => {})
  console.log('  ✓ 示範 Project 建立成功 (未發布)')
}

/**
 * 初始化 Site Settings 資料
 */
async function initSiteSettings() {
  const collection = await getCollection<SiteSettingsDocument>('site_settings')
  const existing = await collection.findOne({ isActive: true })

  if (existing) {
    console.log('  ✓ Site Settings 資料已存在')
    return
  }

  const now = new Date()
  // 預設網站設定，請在後台「網站設定」頁面更新為您的資訊
  const settings: SiteSettingsDocument = {
    siteName: '您的名字',
    siteTitle: '您的名字 - UI/UX 設計師',
    siteDescription: '專注於使用者體驗設計與介面創新，透過設計解決問題，創造價值',
    siteAuthor: '您的名字',
    ogTitle: '您的名字 - UI/UX 設計師',
    ogDescription: '專注於使用者體驗設計與介面創新，透過設計解決問題，創造價值',
    isActive: true,
    createdAt: now,
    updatedAt: now
  }

  await collection.insertOne(settings)
  await collection.createIndex({ isActive: 1 }).catch(() => {})
  console.log('  ✓ Site Settings 資料建立成功')
}

// ==================== 主要 Plugin ====================

export default defineNitroPlugin(async () => {
  try {
    console.log('📦 開始初始化資料庫資料...')

    await initProfile()
    await initSkills()
    await initContact()
    await initDemoProject()
    await initSiteSettings()

    console.log('✅ 資料庫初始化完成')

  } catch (error) {
    console.error('❌ 資料庫初始化失敗:', error)
    // 不中斷應用啟動
  }
})
