/**
 * 環境變數檢查端點（僅供除錯使用）
 * GET /api/admin/debug/env-check
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  return {
    jwtSecretConfigured: !!config.jwtSecret,
    jwtSecretLength: config.jwtSecret?.length || 0,
    cookieSecure: config.cookieSecure,
    mongodbUriConfigured: !!config.mongodbUri,
    env: {
      JWT_SECRET: process.env.JWT_SECRET ? '已設定' : '未設定',
      COOKIE_SECURE: process.env.COOKIE_SECURE || '未設定',
      MONGODB_URI: process.env.MONGODB_URI ? '已設定' : '未設定',
      NODE_ENV: process.env.NODE_ENV || '未設定'
    }
  }
})
