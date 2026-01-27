/**
 * 刪除 User API (Admin)
 * DELETE /api/admin/users/:id
 * 需要 users:delete 權限
 */

import { ObjectId } from 'mongodb'
import { COLLECTIONS } from '~/types/database'
import type { AdminUserDocument } from '~/types/database'
import { hasPermission } from '~/types/permissions'

export default defineEventHandler(async (event) => {
  try {
    // 檢查權限
    const currentUser = getCurrentUser(event)
    if (!currentUser || !hasPermission(currentUser.permissions, 'users:delete')) {
      throw createError({
        statusCode: 403,
        message: '沒有權限執行此操作'
      })
    }

    const id = getRouterParam(event, 'id')

    if (!id || !ObjectId.isValid(id)) {
      throw createError({
        statusCode: 400,
        message: '無效的使用者 ID'
      })
    }

    // 不能刪除自己
    if (id === currentUser.userId) {
      throw createError({
        statusCode: 400,
        message: '不能刪除自己的帳號'
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

    // 刪除使用者
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      throw createError({
        statusCode: 500,
        message: '刪除使用者失敗'
      })
    }

    return {
      success: true,
      message: `使用者「${user.displayName}」已刪除`
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('刪除 User 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '刪除使用者時發生錯誤'
    })
  }
})
