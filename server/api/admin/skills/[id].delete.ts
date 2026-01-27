/**
 * 刪除 Skill Category API (Admin)
 * DELETE /api/admin/skills/:id
 */

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少技能分類 ID'
      })
    }

    // 先取得技能分類資訊（用於記錄）
    const skill = await getSkillByIdForAdmin(id)

    if (!skill) {
      throw createError({
        statusCode: 404,
        message: '找不到此技能分類'
      })
    }

    // 刪除 Skill Category
    const success = await deleteSkillCategory(id)

    if (!success) {
      throw createError({
        statusCode: 500,
        message: '刪除技能分類失敗'
      })
    }

    return {
      success: true,
      message: `技能分類「${skill.title}」已刪除`
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('刪除 Skill 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '刪除技能分類時發生錯誤'
    })
  }
})
