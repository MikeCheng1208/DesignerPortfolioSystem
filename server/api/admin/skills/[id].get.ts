/**
 * 取得單筆 Skill Category 資料 API (Admin)
 * GET /api/admin/skills/:id
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

    // 取得 Skill Category 資料
    const skill = await getSkillByIdForAdmin(id)

    if (!skill) {
      throw createError({
        statusCode: 404,
        message: '找不到此技能分類'
      })
    }

    // 轉換為 API 回應格式
    return {
      success: true,
      skill: {
        _id: skill._id.toString(),
        categoryId: skill.categoryId,
        title: skill.title,
        skills: skill.skills,
        order: skill.order,
        isVisible: skill.isVisible,
        createdAt: skill.createdAt.toISOString(),
        updatedAt: skill.updatedAt.toISOString()
      }
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('取得 Skill 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得技能分類時發生錯誤'
    })
  }
})
