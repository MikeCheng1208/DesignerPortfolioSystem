/**
 * 更新 Skill Category API (Admin)
 * PUT /api/admin/skills/:id
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

    // 讀取請求資料
    const body = await readBody(event)

    // 驗證必填欄位
    if (!body.categoryId || !body.title || !Array.isArray(body.skills)) {
      throw createError({
        statusCode: 400,
        message: '缺少必填欄位：categoryId, title, skills'
      })
    }

    // 檢查 categoryId 是否與其他分類衝突
    const collection = await getCollection('skills')
    const { ObjectId } = await import('mongodb')

    const conflictSkill = await collection.findOne({
      _id: { $ne: new ObjectId(id) },
      categoryId: body.categoryId
    })

    if (conflictSkill) {
      throw createError({
        statusCode: 400,
        message: 'Category ID 與其他技能分類衝突'
      })
    }

    // 準備更新資料
    const updateData = {
      categoryId: body.categoryId.trim(),
      title: body.title.trim(),
      skills: body.skills.filter((s: string) => s.trim()),
      order: body.order !== undefined ? body.order : 0,
      isVisible: body.isVisible !== undefined ? body.isVisible : true
    }

    // 更新 Skill Category
    const result = await updateSkillCategory(id, updateData)

    if (!result) {
      throw createError({
        statusCode: 404,
        message: '找不到此技能分類'
      })
    }

    return {
      success: true,
      message: '技能分類更新成功',
      skill: {
        _id: result._id.toString(),
        categoryId: result.categoryId,
        title: result.title,
        isVisible: result.isVisible,
        updatedAt: result.updatedAt.toISOString()
      }
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('更新 Skill 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '更新技能分類時發生錯誤'
    })
  }
})
