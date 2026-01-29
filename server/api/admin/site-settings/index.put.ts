import { getCollection } from '../../../utils/db'
import type { SiteSettingsDocument } from '../../../../app/types/database'

/**
 * PUT /api/admin/site-settings
 * 更新網站設定（後台 API）
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // 驗證必填欄位
    if (!body.siteName?.trim()) {
      throw createError({
        statusCode: 400,
        message: '網站名稱為必填'
      })
    }

    if (!body.siteTitle?.trim()) {
      throw createError({
        statusCode: 400,
        message: '網站標題為必填'
      })
    }

    // 準備更新資料
    const updateData = {
      siteName: body.siteName.trim(),
      siteTitle: body.siteTitle.trim(),
      siteDescription: body.siteDescription?.trim() || '',
      siteAuthor: body.siteAuthor?.trim() || '',
      ogTitle: body.ogTitle?.trim() || body.siteTitle.trim(),
      ogDescription: body.ogDescription?.trim() || body.siteDescription?.trim() || '',
      ogImage: body.ogImage?.trim() || undefined,
      updatedAt: new Date()
    }

    const collection = await getCollection<SiteSettingsDocument>('site_settings')

    // 更新設定
    const result = await collection.findOneAndUpdate(
      { isActive: true },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw createError({
        statusCode: 404,
        message: '找不到網站設定'
      })
    }

    return {
      success: true,
      message: '網站設定更新成功',
      settings: {
        _id: result._id.toString(),
        siteName: result.siteName,
        siteTitle: result.siteTitle,
        siteDescription: result.siteDescription,
        siteAuthor: result.siteAuthor,
        ogTitle: result.ogTitle,
        ogDescription: result.ogDescription,
        ogImage: result.ogImage,
        isActive: result.isActive,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString()
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('更新網站設定錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '更新網站設定時發生錯誤'
    })
  }
})
