import { getCollection } from '../../../utils/db'
import type { SiteSettingsDocument } from '../../../../app/types/database'
import { DEFAULT_THEMES } from '../../../../app/types/database'

/**
 * GET /api/admin/site-settings
 * 獲取網站設定（後台 API）
 */
export default defineEventHandler(async () => {
  try {
    const collection = await getCollection<SiteSettingsDocument>('site_settings')
    const settings = await collection.findOne({ isActive: true })

    if (!settings) {
      throw createError({
        statusCode: 404,
        message: '找不到網站設定'
      })
    }

    return {
      success: true,
      settings: {
        _id: settings._id.toString(),
        siteName: settings.siteName,
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        siteAuthor: settings.siteAuthor,
        ogTitle: settings.ogTitle,
        ogDescription: settings.ogDescription,
        ogImage: settings.ogImage,
        activeTheme: settings.activeTheme || 'classic',
        isActive: settings.isActive,
        createdAt: settings.createdAt.toISOString(),
        updatedAt: settings.updatedAt.toISOString()
      },
      availableThemes: DEFAULT_THEMES
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('取得網站設定錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得網站設定時發生錯誤'
    })
  }
})
