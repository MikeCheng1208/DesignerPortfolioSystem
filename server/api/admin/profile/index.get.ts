/**
 * 取得 Profile 資料 API (Admin)
 * GET /api/admin/profile
 */

export default defineEventHandler(async (event) => {
  try {
    // 取得 Profile 資料
    const profile = await getProfileForAdmin()

    if (!profile) {
      throw createError({
        statusCode: 404,
        message: '找不到個人資料'
      })
    }

    // 轉換為 API 回應格式
    return {
      success: true,
      profile: {
        _id: profile._id.toString(),
        name: profile.name,
        nameEn: profile.nameEn,
        title: profile.title,
        bio: profile.bio,
        philosophy: profile.philosophy,
        photo: profile.photo,
        heroTitle: profile.heroTitle,
        heroSubtitle: profile.heroSubtitle,
        isActive: profile.isActive,
        createdAt: profile.createdAt.toISOString(),
        updatedAt: profile.updatedAt.toISOString()
      }
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('取得 Profile 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得個人資料時發生錯誤'
    })
  }
})
