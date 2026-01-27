/**
 * Admin 登出 API
 * POST /api/admin/auth/logout
 */

export default defineEventHandler(async (event) => {
  try {
    // 清除認證 Cookie
    clearAuthCookie(event)

    return {
      success: true,
      message: '登出成功'
    }
  } catch (error) {
    console.error('登出錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '登出時發生錯誤'
    })
  }
})
