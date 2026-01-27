/**
 * 更新 Contact 資料 API (Admin)
 * PUT /api/admin/contact
 */

export default defineEventHandler(async (event) => {
  try {
    // 讀取請求資料
    const body = await readBody(event)

    // 驗證必填欄位
    if (!body.text || !Array.isArray(body.links)) {
      throw createError({
        statusCode: 400,
        message: '缺少必填欄位：text, links'
      })
    }

    // 驗證 links 格式
    const validLinks = body.links.every((link: any) =>
      link.id && link.label && link.value && link.url && typeof link.order === 'number'
    )

    if (!validLinks) {
      throw createError({
        statusCode: 400,
        message: 'links 資料格式錯誤'
      })
    }

    // 準備更新資料
    const updateData = {
      text: body.text.trim(),
      links: body.links.map((link: any, index: number) => ({
        id: link.id.trim(),
        label: link.label.trim(),
        value: link.value.trim(),
        url: link.url.trim(),
        icon: link.icon?.trim(),
        order: index // 使用陣列索引作為排序
      }))
    }

    // 更新 Contact
    const result = await updateContact(updateData)

    if (!result) {
      throw createError({
        statusCode: 404,
        message: '找不到聯絡資訊'
      })
    }

    // 取得當前使用者資訊（用於記錄）
    const currentUser = getCurrentUser(event)

    return {
      success: true,
      message: '聯絡資訊更新成功',
      contact: {
        _id: result._id.toString(),
        text: result.text,
        links: result.links,
        isActive: result.isActive,
        createdAt: result.createdAt.toISOString(),
        updatedAt: result.updatedAt.toISOString()
      },
      updatedBy: currentUser?.username
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('更新 Contact 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '更新聯絡資訊時發生錯誤'
    })
  }
})
