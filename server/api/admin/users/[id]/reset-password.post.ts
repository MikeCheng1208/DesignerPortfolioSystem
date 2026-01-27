/**
 * 重置使用者密碼 API (Admin)
 * POST /api/admin/users/:id/reset-password
 * 需要 users:write 權限
 */

import { ObjectId } from 'mongodb'
import { COLLECTIONS } from '~/types/database'
import type { AdminUserDocument } from '~/types/database'
import { hasPermission } from '~/types/permissions'

export default defineEventHandler(async (event) => {
  try {
    // 檢查權限
    const currentUser = getCurrentUser(event)
    if (!currentUser || !hasPermission(currentUser.permissions, 'users:write')) {
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

    // 讀取請求資料
    const body = await readBody(event)

    if (!body.password) {
      throw createError({
        statusCode: 400,
        message: '缺少新密碼'
      })
    }

    // 驗證密碼強度
    const passwordValidation = validatePasswordStrength(body.password)
    if (!passwordValidation.valid) {
      throw createError({
        statusCode: 400,
        message: passwordValidation.message
      })
    }

    // 加密新密碼
    const passwordHash = await hashPassword(body.password)

    // 更新密碼並重置登入失敗記錄
    const collection = await getCollection<AdminUserDocument>(COLLECTIONS.ADMIN_USERS)
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          passwordHash,
          loginAttempts: 0,
          lockedUntil: null,
          updatedBy: currentUser.username,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      throw createError({
        statusCode: 404,
        message: '找不到此使用者'
      })
    }

    return {
      success: true,
      message: `使用者「${result.displayName}」的密碼已重置`
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('重置密碼錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '重置密碼時發生錯誤'
    })
  }
})
