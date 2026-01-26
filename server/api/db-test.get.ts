import { testConnection } from '../utils/db'

/**
 * GET /api/db-test
 * 測試資料庫連線
 */
export default defineEventHandler(async (event) => {
  try {
    const isConnected = await testConnection()

    if (isConnected) {
      return {
        success: true,
        message: '資料庫連線成功！',
        timestamp: new Date().toISOString()
      }
    } else {
      setResponseStatus(event, 500)
      return {
        success: false,
        message: '資料庫連線失敗',
        timestamp: new Date().toISOString()
      }
    }
  } catch (error: any) {
    setResponseStatus(event, 500)
    return {
      success: false,
      message: '資料庫連線錯誤',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
})
