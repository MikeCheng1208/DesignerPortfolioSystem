/**
 * 更新 User API (Admin)
 * PUT /api/admin/users/:id
 * 需要 users:write 權限
 */

import { ObjectId } from 'mongodb'
import { COLLECTIONS } from '~/types/database'
import type { AdminUserDocument, AdminRole } from '~/types/database'
import { hasPermission, getRolePermissions } from '~/types/permissions'

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

    // 驗證必填欄位
    if (!body.username || !body.email || !body.displayName || !body.role) {
      throw createError({
        statusCode: 400,
        message: '缺少必填欄位'
      })
    }

    // 驗證角色
    const validRoles: AdminRole[] = ['super_admin', 'admin', 'editor']
    if (!validRoles.includes(body.role)) {
      throw createError({
        statusCode: 400,
        message: '無效的角色'
      })
    }

    // 檢查 username 和 email 是否與其他使用者衝突
    const collection = await getCollection<AdminUserDocument>(COLLECTIONS.ADMIN_USERS)
    const conflictUser = await collection.findOne({
      _id: { $ne: new ObjectId(id) },
      $or: [
        { username: body.username },
        { email: body.email }
      ]
    })

    if (conflictUser) {
      throw createError({
        statusCode: 400,
        message: '帳號或 Email 與其他使用者衝突'
      })
    }

    // 取得角色的預設權限
    const defaultPermissions = getRolePermissions(body.role)

    // 準備更新資料
    const updateData: any = {
      username: body.username.trim(),
      email: body.email.trim(),
      displayName: body.displayName.trim(),
      role: body.role,
      permissions: defaultPermissions,
      isActive: body.isActive !== undefined ? body.isActive : true,
      avatar: body.avatar?.trim(),
      updatedBy: currentUser.username,
      updatedAt: new Date()
    }

    // 如果提供了新密碼，則更新密碼
    if (body.password && body.password.trim()) {
      const passwordValidation = validatePasswordStrength(body.password)
      if (!passwordValidation.valid) {
        throw createError({
          statusCode: 400,
          message: passwordValidation.message
        })
      }

      updateData.passwordHash = await hashPassword(body.password)
      updateData.loginAttempts = 0
      updateData.lockedUntil = null
    }

    // 更新使用者
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
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
      message: '使用者更新成功',
      user: toAdminUserResponse(result)
    }
  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('更新 User 錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '更新使用者時發生錯誤'
    })
  }
})
