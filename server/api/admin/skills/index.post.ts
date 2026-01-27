/**
 * 新增 Skill Category API (Admin)
 * POST /api/admin/skills
 */

export default defineEventHandler(async (event) => {
  try {
    // 讀取請求資料
    const body = await readBody(event)

    // 驗證必填欄位
    if (!body.categoryId || !body.title || !Array.isArray(body.skills)) {
      throw createError({
        statusCode: 400,
        message: '缺少必填欄位：categoryId, title, skills'
      })
    }

    // 檢查 categoryId 是否已存在
    const collection = await getCollection('skills')
    const existingSkill = await collection.findOne({
      categoryId: body.categoryId
    })

    if (existingSkill) {
      throw createError({
        statusCode: 400,
        message: 'Category ID 已存在'
      })
    }

    // 準備資料
    const skillData = {
      categoryId: body.categoryId.trim(),
      title: body.title.trim(),
      skills: body.skills.filter((s: string) => s.trim()),
      order: body.order !== undefined ? body.order : 0,
      isVisible: body.isVisible !== undefined ? body.isVisible : true
    }

    // 建立 Skill Category
    const result = await createSkillCategory(skillData)

    // 取得新建立的 Skill
    const newSkill = await collection.findOne({ _id: result.insertedId })

    if (!newSkill) {
      throw createError({
        statusCode: 500,
        message: '建立技能分類後無法取得資料'
      })
    }

    return {
      success: true,
      message: '技能分類建立成功',
      skill: {
        _id: newSkill._id.toString(),
        categoryId: newSkill.categoryId,
        title: newSkill.title,
        isVisible: newSkill.isVisible
      }
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('建立 Skill 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '建立技能分類時發生錯誤'
    })
  }
})
