/**
 * Admin 登入 API
 * POST /api/admin/auth/login
 */

import type { AdminUserDocument } from '~/types/database'
import { COLLECTIONS } from '~/types/database'

interface LoginRequest {
  username: string
  password: string
}

export default defineEventHandler(async (event) => {
  try {
    // 讀取請求資料
    const body = await readBody<LoginRequest>(event)

    // 驗證輸入
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: '請提供帳號和密碼'
      })
    }

    // 查詢使用者
    const collection = await getCollection<AdminUserDocument>(COLLECTIONS.ADMIN_USERS)
    const user = await collection.findOne({
      username: body.username
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: '帳號或密碼錯誤'
      })
    }

    // 檢查帳號是否啟用
    if (!user.isActive) {
      throw createError({
        statusCode: 403,
        message: '此帳號已被停用'
      })
    }

    // 檢查帳號是否被鎖定
    if (isAccountLocked(user)) {
      const lockedMinutes = Math.ceil(
        (user.lockedUntil!.getTime() - Date.now()) / 60000
      )
      throw createError({
        statusCode: 403,
        message: `帳號已被鎖定，請在 ${lockedMinutes} 分鐘後再試`
      })
    }

    // 驗證密碼
    const isPasswordValid = await verifyPassword(body.password, user.passwordHash)

    if (!isPasswordValid) {
      // 處理登入失敗
      const failureUpdate = handleLoginFailure(user)

      await collection.updateOne(
        { _id: user._id },
        {
          $set: {
            ...failureUpdate,
            updatedAt: new Date()
          }
        }
      )

      // 如果帳號被鎖定，返回特殊訊息
      if (failureUpdate.lockedUntil) {
        throw createError({
          statusCode: 403,
          message: '登入失敗次數過多，帳號已被鎖定 15 分鐘'
        })
      }

      throw createError({
        statusCode: 401,
        message: '帳號或密碼錯誤'
      })
    }

    // 登入成功，重置失敗次數
    const successUpdate = resetLoginAttempts()

    await collection.updateOne(
      { _id: user._id },
      {
        $set: {
          ...successUpdate,
          lastLoginAt: new Date(),
          updatedAt: new Date()
        }
      }
    )

    // 生成 JWT Token
    const token = generateToken(user)

    // 設置 Cookie
    setAuthCookie(event, token)

    // 更新 user 物件以包含最新的 lastLoginAt
    user.lastLoginAt = new Date()
    user.loginAttempts = 0
    user.lockedUntil = undefined

    // 返回使用者資訊（不包含敏感資訊）
    return {
      success: true,
      message: '登入成功',
      user: toAdminUserResponse(user)
    }

  } catch (error: any) {
    // 如果是已知的錯誤，直接拋出
    if (error.statusCode) {
      throw error
    }

    // 未知錯誤
    console.error('登入錯誤:', error)
    throw createError({
      statusCode: 500,
      message: '登入時發生錯誤'
    })
  }
})
