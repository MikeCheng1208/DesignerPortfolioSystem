/**
 * Admin 錯誤處理 Composable
 * 提供統一的錯誤處理和使用者友好的錯誤訊息
 */

interface ErrorHandlerOptions {
  showToast?: boolean
  toastTitle?: string
  redirectOnAuth?: boolean
  logError?: boolean
}

export const useErrorHandler = () => {
  const toast = useToast()
  const router = useRouter()

  /**
   * 錯誤訊息映射表
   */
  const errorMessages: Record<string, string> = {
    // 認證相關
    'INVALID_CREDENTIALS': '帳號或密碼錯誤',
    'ACCOUNT_LOCKED': '帳號已被鎖定，請稍後再試',
    'SESSION_EXPIRED': '登入已過期，請重新登入',
    'UNAUTHORIZED': '您沒有權限執行此操作',
    'FORBIDDEN': '存取被拒絕',

    // 資料驗證
    'VALIDATION_ERROR': '資料驗證失敗，請檢查輸入',
    'REQUIRED_FIELD': '請填寫所有必填欄位',
    'INVALID_EMAIL': '請輸入有效的 Email 地址',
    'INVALID_PASSWORD': '密碼格式不正確',
    'PASSWORD_TOO_SHORT': '密碼至少需要 8 個字元',
    'USERNAME_EXISTS': '此帳號已被使用',
    'EMAIL_EXISTS': '此 Email 已被使用',

    // 資源相關
    'NOT_FOUND': '找不到指定的資料',
    'ALREADY_EXISTS': '資料已存在',
    'CANNOT_DELETE': '無法刪除此項目',
    'CANNOT_DELETE_SELF': '無法刪除自己的帳號',

    // 伺服器錯誤
    'SERVER_ERROR': '伺服器發生錯誤',
    'DATABASE_ERROR': '資料庫連線錯誤',
    'NETWORK_ERROR': '網路連線錯誤',

    // 預設訊息
    'UNKNOWN_ERROR': '發生未知錯誤，請稍後再試'
  }

  /**
   * 處理錯誤
   */
  const handleError = (
    error: any,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      toastTitle = '錯誤',
      redirectOnAuth = true,
      logError = true
    } = options

    // 記錄錯誤
    if (logError) {
      console.error('Error:', error)
    }

    // 取得錯誤訊息
    const message = getErrorMessage(error)
    const statusCode = error?.statusCode || error?.status || 500

    // 顯示 Toast
    if (showToast) {
      toast.add({
        title: toastTitle,
        description: message,
        color: 'red',
        icon: 'i-heroicons-exclamation-circle',
        timeout: 5000
      })
    }

    // 處理認證錯誤
    if (redirectOnAuth && (statusCode === 401 || statusCode === 403)) {
      const route = useRoute()

      // 延遲導向以確保 toast 顯示
      setTimeout(() => {
        if (statusCode === 401) {
          router.push('/admin/login')
        } else if (statusCode === 403 && !route.path.includes('/dashboard')) {
          router.push('/admin/dashboard')
        }
      }, 1000)
    }

    return {
      message,
      statusCode,
      originalError: error
    }
  }

  /**
   * 取得友好的錯誤訊息
   */
  const getErrorMessage = (error: any): string => {
    // 1. 檢查錯誤代碼
    if (error?.code && errorMessages[error.code]) {
      return errorMessages[error.code]
    }

    // 2. 檢查 API 回傳的訊息
    if (error?.data?.message) {
      return error.data.message
    }

    // 3. 檢查錯誤物件的訊息
    if (error?.message) {
      // 如果訊息在映射表中
      if (errorMessages[error.message]) {
        return errorMessages[error.message]
      }

      // 在開發環境返回原始訊息
      if (process.dev) {
        return error.message
      }
    }

    // 4. 根據狀態碼返回訊息
    const statusCode = error?.statusCode || error?.status

    switch (statusCode) {
      case 400:
        return '請求格式錯誤'
      case 401:
        return '請先登入'
      case 403:
        return '您沒有權限執行此操作'
      case 404:
        return '找不到指定的資料'
      case 409:
        return '資料衝突，可能已存在'
      case 422:
        return '資料驗證失敗'
      case 429:
        return '請求過於頻繁，請稍後再試'
      case 500:
        return '伺服器發生錯誤'
      case 503:
        return '服務暫時無法使用'
      default:
        return errorMessages.UNKNOWN_ERROR
    }
  }

  /**
   * 包裝非同步操作
   * 自動處理錯誤並返回 { data, error }
   */
  const tryAsync = async <T = any>(
    operation: () => Promise<T>,
    options: ErrorHandlerOptions = {}
  ): Promise<{ data: T | null; error: any }> => {
    try {
      const data = await operation()
      return { data, error: null }
    } catch (error) {
      const handledError = handleError(error, options)
      return { data: null, error: handledError }
    }
  }

  /**
   * 驗證欄位
   */
  const validateField = (
    value: any,
    rules: {
      required?: boolean
      email?: boolean
      minLength?: number
      maxLength?: number
      pattern?: RegExp
    }
  ): { valid: boolean; message?: string } => {
    // Required
    if (rules.required && (!value || value.toString().trim() === '')) {
      return { valid: false, message: '此欄位為必填' }
    }

    // 如果沒有值且非必填，視為有效
    if (!value) {
      return { valid: true }
    }

    const strValue = value.toString()

    // Email
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(strValue)) {
        return { valid: false, message: '請輸入有效的 Email 地址' }
      }
    }

    // Min Length
    if (rules.minLength && strValue.length < rules.minLength) {
      return {
        valid: false,
        message: `至少需要 ${rules.minLength} 個字元`
      }
    }

    // Max Length
    if (rules.maxLength && strValue.length > rules.maxLength) {
      return {
        valid: false,
        message: `最多 ${rules.maxLength} 個字元`
      }
    }

    // Pattern
    if (rules.pattern && !rules.pattern.test(strValue)) {
      return { valid: false, message: '格式不正確' }
    }

    return { valid: true }
  }

  return {
    handleError,
    getErrorMessage,
    tryAsync,
    validateField
  }
}
