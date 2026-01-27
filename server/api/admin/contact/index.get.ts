/**
 * 取得 Contact 資料 API (Admin)
 * GET /api/admin/contact
 */

export default defineEventHandler(async (event) => {
  try {
    // 取得 Contact 資料
    const contact = await getContactForAdmin()

    if (!contact) {
      throw createError({
        statusCode: 404,
        message: '找不到聯絡資訊'
      })
    }

    // 轉換為 API 回應格式
    return {
      success: true,
      contact: {
        _id: contact._id.toString(),
        text: contact.text,
        links: contact.links,
        isActive: contact.isActive,
        createdAt: contact.createdAt.toISOString(),
        updatedAt: contact.updatedAt.toISOString()
      }
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('取得 Contact 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得聯絡資訊時發生錯誤'
    })
  }
})
