/**
 * 切換 Project 發布狀態 API (Admin)
 * POST /api/admin/projects/:id/publish
 */

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少作品 ID'
      })
    }

    // 讀取請求資料
    const body = await readBody(event)

    if (body.published === undefined) {
      throw createError({
        statusCode: 400,
        message: '缺少 published 參數'
      })
    }

    // 切換發布狀態
    const result = await toggleProjectPublish(id, body.published)

    if (!result) {
      throw createError({
        statusCode: 404,
        message: '找不到此作品'
      })
    }

    const status = result.published ? '已發布' : '已取消發布'

    return {
      success: true,
      message: `作品「${result.title}」${status}`,
      project: {
        _id: result._id.toString(),
        projectId: result.projectId,
        title: result.title,
        published: result.published,
        updatedAt: result.updatedAt.toISOString()
      }
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('切換發布狀態錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '切換發布狀態時發生錯誤'
    })
  }
})
