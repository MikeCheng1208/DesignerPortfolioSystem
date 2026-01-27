/**
 * 取得所有 Skills 列表 API (Admin)
 * GET /api/admin/skills
 * 包含不可見的技能分類
 */

export default defineEventHandler(async (event) => {
  try {
    // 取得所有 Skills（包含不可見的）
    const skills = await getAllSkillsForAdmin()

    // 轉換為 API 回應格式
    const skillList = skills.map(skill => ({
      _id: skill._id.toString(),
      categoryId: skill.categoryId,
      title: skill.title,
      skills: skill.skills,
      order: skill.order,
      isVisible: skill.isVisible,
      createdAt: skill.createdAt.toISOString(),
      updatedAt: skill.updatedAt.toISOString()
    }))

    return {
      success: true,
      skills: skillList,
      total: skillList.length
    }
  } catch (error: any) {
    console.error('取得 Skills 列表錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得技能列表時發生錯誤'
    })
  }
})
