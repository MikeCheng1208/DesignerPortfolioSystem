/**
 * 建立新 User API (Admin)
 * POST /api/admin/users
 * 需要 users:write 權限
 */

import { COLLECTIONS } from '~/types/database'
import type { AdminUserDocument, AdminRole } from '~/types/database'
import { hasPermission, getRolePermissions } from '~/types/permissions'

export default defineEventHandler(async (event) => {
  try {
    // 檢查權限
    const currentUser = getCurrentUser(event)
    if (!currentUser || !hasPermission(currentUser.permissions, 'users:write')) {
      throw createForbiddenError()
    }

    // 讀取請求資料
    const body = await readBody(event)

    // 驗證必填欄位
    validateRequired(body, ['username', 'email', 'password', 'displayName', 'role'])

    // 驗證 Email 格式
    if (!validateEmail(body.email)) {
      throw createValidationError('請輸入有效的 Email 地址', { email: '無效的 Email 格式' })
    }

    // 驗證角色
    const validRoles: AdminRole[] = ['super_admin', 'admin', 'editor']
    if (!validRoles.includes(body.role)) {
      throw createValidationError('無效的角色', { role: '請選擇有效的角色' })
    }

    // 驗證密碼強度
    const passwordValidation = validatePasswordStrength(body.password)
    if (!passwordValidation.valid) {
      throw createValidationError(passwordValidation.message || '密碼格式不正確', {
        password: passwordValidation.message
      })
    }

    // 檢查 username 和 email 是否已存在
    const collection = await getCollection<AdminUserDocument>(COLLECTIONS.ADMIN_USERS)
    const existingUser = await collection.findOne({
      $or: [
        { username: body.username },
        { email: body.email }
      ]
    })

    if (existingUser) {
      if (existingUser.username === body.username) {
        throw createStandardError(409, '此帳號已被使用', ERROR_CODES.USERNAME_EXISTS)
      }
      throw createStandardError(409, '此 Email 已被使用', ERROR_CODES.EMAIL_EXISTS)
    }

    // 加密密碼
    const passwordHash = await hashPassword(body.password)

    // 取得角色的預設權限
    const defaultPermissions = getRolePermissions(body.role)

    // 準備使用者資料
    const now = new Date()
    const newUser: Omit<AdminUserDocument, '_id'> = {
      username: body.username.trim(),
      email: body.email.trim(),
      passwordHash,
      displayName: body.displayName.trim(),
      role: body.role,
      permissions: defaultPermissions,
      isActive: body.isActive !== undefined ? body.isActive : true,
      loginAttempts: 0,
      avatar: body.avatar?.trim(),
      createdBy: currentUser.username,
      createdAt: now,
      updatedAt: now
    }

    // 建立使用者
    const result = await collection.insertOne(newUser as AdminUserDocument)

    // 取得新建立的使用者
    const createdUser = await collection.findOne({ _id: result.insertedId })

    if (!createdUser) {
      throw createError({
        statusCode: 500,
        message: '建立使用者後無法取得資料'
      })
    }

    return {
      success: true,
      message: '使用者建立成功',
      user: toAdminUserResponse(createdUser)
    }
  } catch (error: any) {
    handleUncaughtError(error, '建立使用者時發生錯誤')
  }
})
