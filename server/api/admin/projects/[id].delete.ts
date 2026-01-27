/**
 * 刪除 Project API (Admin)
 * DELETE /api/admin/projects/:id
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

    // 先取得作品資訊（用於記錄）
    const project = await getProjectByIdForAdmin(id)

    if (!project) {
      throw createError({
        statusCode: 404,
        message: '找不到此作品'
      })
    }

    // 刪除 Project
    const success = await deleteProject(id)

    if (!success) {
      throw createError({
        statusCode: 500,
        message: '刪除作品失敗'
      })
    }

    return {
      success: true,
      message: `作品「${project.title}」已刪除`
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('刪除 Project 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '刪除作品時發生錯誤'
    })
  }
})
