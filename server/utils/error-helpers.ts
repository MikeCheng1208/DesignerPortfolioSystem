/**
 * 伺服器端錯誤處理工具函數
 */

/**
 * 錯誤代碼常數
 */
export const ERROR_CODES = {
  // 認證相關
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_DISABLED: 'ACCOUNT_DISABLED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',

  // 資料驗證
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_EMAIL: 'INVALID_EMAIL',
  INVALID_PASSWORD: 'INVALID_PASSWORD',
  PASSWORD_TOO_SHORT: 'PASSWORD_TOO_SHORT',

  // 資源相關
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  USERNAME_EXISTS: 'USERNAME_EXISTS',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  CANNOT_DELETE: 'CANNOT_DELETE',
  CANNOT_DELETE_SELF: 'CANNOT_DELETE_SELF',

  // 伺服器錯誤
  SERVER_ERROR: 'SERVER_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR'
} as const

/**
 * 創建標準化的錯誤
 */
export function createStandardError(
  statusCode: number,
  message: string,
  code?: string,
  data?: any
) {
  return createError({
    statusCode,
    message,
    data: {
      code,
      ...data
    }
  })
}

/**
 * 創建驗證錯誤
 */
export function createValidationError(message: string, fields?: Record<string, string>) {
  return createStandardError(
    400,
    message,
    ERROR_CODES.VALIDATION_ERROR,
    { fields }
  )
}

/**
 * 創建未授權錯誤
 */
export function createUnauthorizedError(message = '請先登入') {
  return createStandardError(
    401,
    message,
    ERROR_CODES.UNAUTHORIZED
  )
}

/**
 * 創建禁止存取錯誤
 */
export function createForbiddenError(message = '您沒有權限執行此操作') {
  return createStandardError(
    403,
    message,
    ERROR_CODES.FORBIDDEN
  )
}

/**
 * 創建資源不存在錯誤
 */
export function createNotFoundError(resourceName = '資源') {
  return createStandardError(
    404,
    `找不到指定的${resourceName}`,
    ERROR_CODES.NOT_FOUND
  )
}

/**
 * 創建資源已存在錯誤
 */
export function createAlreadyExistsError(resourceName = '資源') {
  return createStandardError(
    409,
    `${resourceName}已存在`,
    ERROR_CODES.ALREADY_EXISTS
  )
}

/**
 * 創建伺服器錯誤
 */
export function createServerError(message = '伺服器發生錯誤') {
  return createStandardError(
    500,
    message,
    ERROR_CODES.SERVER_ERROR
  )
}

/**
 * 創建資料庫錯誤
 */
export function createDatabaseError(message = '資料庫操作失敗') {
  return createStandardError(
    500,
    message,
    ERROR_CODES.DATABASE_ERROR
  )
}

/**
 * 處理未捕獲的錯誤
 */
export function handleUncaughtError(error: any, defaultMessage = '發生未知錯誤') {
  // 記錄錯誤
  console.error('Uncaught Error:', error)

  // 如果已經是 H3Error，直接拋出
  if (error.statusCode) {
    throw error
  }

  // MongoDB 錯誤處理
  if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    // 重複鍵錯誤
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || '資料'
      throw createAlreadyExistsError(field)
    }

    throw createDatabaseError('資料庫操作失敗')
  }

  // 其他錯誤
  throw createServerError(defaultMessage)
}

/**
 * 驗證必填欄位
 */
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): void {
  const missingFields: string[] = []

  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    throw createValidationError(
      '請填寫所有必填欄位',
      Object.fromEntries(missingFields.map(f => [f, '此欄位為必填']))
    )
  }
}

/**
 * 驗證 Email 格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * 驗證密碼強度
 * 至少 8 字元，包含大小寫字母和數字
 */
export function validatePasswordStrength(password: string): {
  valid: boolean
  message?: string
} {
  if (password.length < 8) {
    return { valid: false, message: '密碼至少需要 8 個字元' }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: '密碼必須包含小寫字母' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: '密碼必須包含大寫字母' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: '密碼必須包含數字' }
  }

  return { valid: true }
}

/**
 * 安全地轉換為 ObjectId
 */
export function safeObjectId(id: string): any {
  try {
    const { ObjectId } = require('mongodb')
    if (!ObjectId.isValid(id)) {
      throw createValidationError('無效的 ID 格式')
    }
    return new ObjectId(id)
  } catch (error) {
    throw createValidationError('無效的 ID 格式')
  }
}
