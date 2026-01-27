/**
 * 取得當前登入使用者資訊 API
 * GET /api/admin/auth/me
 */

import { ObjectId } from 'mongodb'
import type { AdminUserDocument } from '~/types/database'
import { COLLECTIONS } from '~/types/database'

/**
 * 重試資料庫操作
 */
async function retryDatabaseOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

      // 如果是認證相關錯誤,不重試
      if (error.statusCode === 401 || error.statusCode === 403) {
        throw error
      }

      // 如果是資料庫連線錯誤且還有重試次數,等待後重試
      if (attempt < maxRetries) {
        console.log(`⚠️ 資料庫操作失敗,正在重試 (${attempt + 1}/${maxRetries})...`)
        await new Promise(resolve => setTimeout(resolve, 200 * (attempt + 1)))
        continue
      }
    }
  }

  throw lastError
}

export default defineEventHandler(async (event) => {
  try {
    // 取得當前使用者資訊
    const currentUser = getCurrentUser(event)

    if (!currentUser) {
      throw createError({
        statusCode: 401,
        message: '未登入或登入已過期'
      })
    }

    // 使用重試機制從資料庫取得最新的使用者資料
    const user = await retryDatabaseOperation(async () => {
      const collection = await getCollection<AdminUserDocument>(COLLECTIONS.ADMIN_USERS)
      return await collection.findOne({
        _id: new ObjectId(currentUser.userId)
      })
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: '使用者不存在'
      })
    }

    // 檢查帳號是否啟用
    if (!user.isActive) {
      throw createError({
        statusCode: 403,
        message: '此帳號已被停用'
      })
    }

    return {
      success: true,
      user: toAdminUserResponse(user)
    }

  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('取得使用者資訊錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得使用者資訊時發生錯誤'
    })
  }
})
