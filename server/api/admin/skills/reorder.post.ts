/**
 * 更新 Skills 排序 API (Admin)
 * POST /api/admin/skills/reorder
 */

export default defineEventHandler(async (event) => {
  try {
    // 讀取請求資料
    const body = await readBody(event)

    if (!Array.isArray(body.orders)) {
      throw createError({
        statusCode: 400,
        message: '缺少 orders 參數'
      })
    }

    // 驗證資料格式
    const validOrders = body.orders.every((item: any) =>
      item.id && typeof item.order === 'number'
    )

    if (!validOrders) {
      throw createError({
        statusCode: 400,
        message: 'orders 資料格式錯誤'
      })
    }

    // 更新排序
    await reorderSkills(body.orders)

    return {
      success: true,
      message: '排序更新成功'
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('更新排序錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '更新排序時發生錯誤'
    })
  }
})
