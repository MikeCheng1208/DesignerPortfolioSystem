/**
 * 認證相關工具函數
 * 處理密碼加密、JWT 生成和驗證、Cookie 設置等
 */

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import type { AdminUserDocument, AdminUserResponse } from '~/types/database'

const SALT_ROUNDS = 10
const TOKEN_EXPIRES_IN = '7d'
const COOKIE_NAME = 'admin_token'
const MAX_LOGIN_ATTEMPTS = 5
const LOCK_TIME = 15 * 60 * 1000 // 15 分鐘

/**
 * JWT Payload 介面
 */
export interface JWTPayload {
  userId: string
  username: string
  role: string
  permissions: string[]
  iat?: number
  exp?: number
}

/**
 * 雜湊密碼
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 驗證密碼
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * 生成 JWT Token
 */
export function generateToken(user: AdminUserDocument): string {
  const config = useRuntimeConfig()

  console.log('🔍 檢查 JWT_SECRET 配置')
  console.log('   process.env.JWT_SECRET:', process.env.JWT_SECRET ? '已設定' : '未設定')
  console.log('   config.jwtSecret 存在:', !!config.jwtSecret)
  console.log('   config.jwtSecret 長度:', config.jwtSecret?.length || 0)

  if (!config.jwtSecret) {
    console.error('❌ JWT_SECRET 未配置！')
    console.error('   請確認 Zeabur 環境變數中已設定 JWT_SECRET')
    throw new Error('JWT_SECRET is not configured')
  }

  const payload: JWTPayload = {
    userId: user._id.toString(),
    username: user.username,
    role: user.role,
    permissions: user.permissions
  }

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: TOKEN_EXPIRES_IN
  })
}

/**
 * 驗證 JWT Token
 */
export function verifyToken(token: string): JWTPayload | null {
  const config = useRuntimeConfig()

  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not configured')
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * 設置認證 Cookie
 */
export function setAuthCookie(event: H3Event, token: string) {
  const config = useRuntimeConfig()

  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.cookieSecure,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 天
    path: '/'
  })
}

/**
 * 清除認證 Cookie
 */
export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME)
}

/**
 * 從請求中取得 Token
 */
export function getTokenFromRequest(event: H3Event): string | null {
  // 優先從 Cookie 取得
  const cookieToken = getCookie(event, COOKIE_NAME)
  if (cookieToken) {
    return cookieToken
  }

  // 備用：從 Authorization header 取得
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }

  return null
}

/**
 * 從請求中取得當前使用者資訊
 */
export function getCurrentUser(event: H3Event): JWTPayload | null {
  const token = getTokenFromRequest(event)
  if (!token) {
    return null
  }

  return verifyToken(token)
}

/**
 * 檢查帳號是否被鎖定
 */
export function isAccountLocked(user: AdminUserDocument): boolean {
  if (!user.lockedUntil) {
    return false
  }

  // 檢查鎖定時間是否已過
  const now = new Date()
  if (now < user.lockedUntil) {
    return true
  }

  return false
}

/**
 * 處理登入失敗
 * 增加失敗次數，必要時鎖定帳號
 */
export function handleLoginFailure(user: AdminUserDocument): {
  loginAttempts: number
  lockedUntil: Date | null
} {
  const attempts = (user.loginAttempts || 0) + 1

  let lockedUntil: Date | null = null

  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    lockedUntil = new Date(Date.now() + LOCK_TIME)
  }

  return {
    loginAttempts: attempts,
    lockedUntil
  }
}

/**
 * 重置登入失敗次數
 */
export function resetLoginAttempts(): {
  loginAttempts: number
  lockedUntil: null
} {
  return {
    loginAttempts: 0,
    lockedUntil: null
  }
}

/**
 * 將 AdminUserDocument 轉換為安全的 Response 格式
 * 移除敏感資訊如密碼雜湊
 */
export function toAdminUserResponse(user: AdminUserDocument): AdminUserResponse {
  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    permissions: user.permissions,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt?.toISOString(),
    avatar: user.avatar,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  }
}

