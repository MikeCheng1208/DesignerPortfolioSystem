/**
 * 取得單筆 User 資料 API (Admin)
 * GET /api/admin/users/:id
 * 需要 users:read 權限
 */

import { ObjectId } from 'mongodb'
import { COLLECTIONS } from '~/types/database'
import type { AdminUserDocument } from '~/types/database'
import { hasPermission } from '~/types/permissions'

export default defineEventHandler(async (event) => {
  try {
    // 檢查權限
    const currentUser = getCurrentUser(event)
    if (!currentUser || !hasPermission(currentUser.permissions, 'users:read')) {
      throw createError({
        statusCode: 403,
        message: '沒有權限執行此操作'
      })
    }

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: '缺少使用者 ID'
      })
    }

    if (!ObjectId.isValid(id)) {
      throw createError({
        statusCode: 400,
        message: '無效的使用者 ID'
      })
    }

    // 取得使用者資料
    const collection = await getCollection<AdminUserDocument>(COLLECTIONS.ADMIN_USERS)
    const user = await collection.findOne({ _id: new ObjectId(id) })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: '找不到此使用者'
      })
    }

    // 轉換為 API 回應格式
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
    console.error('取得 User 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得使用者資料時發生錯誤'
    })
  }
})
