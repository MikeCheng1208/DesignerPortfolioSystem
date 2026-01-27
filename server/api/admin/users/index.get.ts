/**
 * 取得所有 Users 列表 API (Admin)
 * GET /api/admin/users
 * 需要 users:read 權限
 */

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

    // 取得所有使用者
    const collection = await getCollection<AdminUserDocument>(COLLECTIONS.ADMIN_USERS)
    const users = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // 轉換為 API 回應格式（移除敏感資訊）
    const userList = users.map(user => toAdminUserResponse(user))

    return {
      success: true,
      users: userList,
      total: userList.length
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('取得 Users 列表錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '取得使用者列表時發生錯誤'
    })
  }
})
