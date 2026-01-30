import { getActiveSiteSettings } from '../utils/db-helpers'
import { getThemeById, DEFAULT_THEMES } from '../../app/types/database'
import type { SiteSettings } from '../../app/types/api'

/**
 * GET /api/site-settings
 * 獲取網站設定（公開 API）
 */
export default defineEventHandler(async (): Promise<SiteSettings> => {
  try {
    const settings = await getActiveSiteSettings()

    if (!settings) {
      // 如果沒有設定，返回預設值
      return {
        siteName: '個人作品集',
        siteTitle: '個人作品集',
        siteDescription: '歡迎來到我的作品集網站',
        siteAuthor: '',
        activeTheme: 'classic',
        theme: DEFAULT_THEMES[0]
      }
    }

    // 根據 activeTheme 取得完整主題配置
    const activeTheme = settings.activeTheme || 'classic'
    const theme = getThemeById(activeTheme)

    return {
      siteName: settings.siteName,
      siteTitle: settings.siteTitle,
      siteDescription: settings.siteDescription,
      siteAuthor: settings.siteAuthor,
      ogTitle: settings.ogTitle,
      ogDescription: settings.ogDescription,
      ogImage: settings.ogImage,
      activeTheme,
      theme
    }
  } catch (error: any) {
    console.error('獲取網站設定失敗:', error)
    // 發生錯誤時返回預設值，避免網站無法顯示
    return {
      siteName: '個人作品集',
      siteTitle: '個人作品集',
      siteDescription: '歡迎來到我的作品集網站',
      siteAuthor: '',
      activeTheme: 'classic',
      theme: DEFAULT_THEMES[0]
    }
  }
})
