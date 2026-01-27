/**
 * 更新 Profile 資料 API (Admin)
 * PUT /api/admin/profile
 */

export default defineEventHandler(async (event) => {
  try {
    // 讀取請求資料
    const body = await readBody(event)
    console.log('收到更新請求，資料:', body)

    // 判斷是否為完整更新或部分更新（只更新標語）
    const isPartialUpdate = !body.name && !body.nameEn && !body.title
    console.log('是否為部分更新:', isPartialUpdate)

    // 只在完整更新時進行驗證
    if (!isPartialUpdate) {
      const validation = validateProfileData(body)
      if (!validation.valid) {
        throw createError({
          statusCode: 400,
          message: validation.errors.join(', ')
        })
      }
    }

    // 準備更新資料
    const updateData: any = {}

    // 完整更新或部分更新
    if (!isPartialUpdate) {
      updateData.name = body.name?.trim()
      updateData.nameEn = body.nameEn?.trim()
      updateData.title = body.title?.trim()
      updateData.bio = body.bio?.map((line: string) => line.trim())
      updateData.philosophy = body.philosophy?.trim()
      updateData.photo = body.photo || undefined
    }

    // 添加首頁標語欄位（如果有提供）
    if (body.heroTitle !== undefined) {
      updateData.heroTitle = body.heroTitle?.trim() || ''
    }
    if (body.heroSubtitle !== undefined) {
      updateData.heroSubtitle = body.heroSubtitle?.trim() || ''
    }

    // 檢查是否有要更新的資料
    if (Object.keys(updateData).length === 0) {
      throw createError({
        statusCode: 400,
        message: '沒有提供要更新的資料'
      })
    }

    // 更新 Profile
    const result = await updateProfile(updateData)

    if (!result) {
      throw createError({
        statusCode: 404,
        message: '找不到個人資料'
      })
    }

    // 取得更新後的使用者資訊（用於記錄）
    const currentUser = getCurrentUser(event)

    return {
      success: true,
      message: '個人資料更新成功',
      profile: {
        _id: result._id.toString(),
        name: result.name,
        nameEn: result.nameEn,
        title: result.title,
        bio: result.bio,
        philosophy: result.philosophy,
        photo: result.photo,
        heroTitle: result.heroTitle,
        heroSubtitle: result.heroSubtitle,
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
    console.error('更新 Profile 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '更新個人資料時發生錯誤'
    })
  }
})
