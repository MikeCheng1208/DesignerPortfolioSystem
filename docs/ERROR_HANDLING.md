# 錯誤處理指南

本文檔說明系統的錯誤處理機制和最佳實踐。

## 概述

系統實作了統一的錯誤處理機制,包括:
- 全域錯誤頁面 (`app/error.vue`)
- 前端錯誤處理 Composable (`useErrorHandler`)
- 伺服器端錯誤處理工具 (`error-helpers.ts`)
- 全域錯誤處理 Plugin

## 前端錯誤處理

### 使用 useErrorHandler

```typescript
const { handleError, tryAsync, validateField } = useErrorHandler()

// 方式 1: 手動處理錯誤
try {
  await api.post('/api/admin/users', userData)
} catch (error) {
  handleError(error, {
    showToast: true,
    toastTitle: '建立失敗',
    redirectOnAuth: true
  })
}

// 方式 2: 使用 tryAsync 自動處理
const { data, error } = await tryAsync(
  () => api.post('/api/admin/users', userData),
  { showToast: true }
)

if (error) {
  // 錯誤已自動處理
  return
}
```

### 表單驗證

```typescript
const { validateField } = useErrorHandler()

// 驗證單一欄位
const validation = validateField(email, {
  required: true,
  email: true
})

if (!validation.valid) {
  console.log(validation.message) // "請輸入有效的 Email 地址"
}

// 驗證密碼
const passwordValidation = validateField(password, {
  required: true,
  minLength: 8
})
```

### 錯誤訊息映射

`useErrorHandler` 提供了友好的錯誤訊息映射:

```typescript
const errorMessages = {
  'INVALID_CREDENTIALS': '帳號或密碼錯誤',
  'ACCOUNT_LOCKED': '帳號已被鎖定，請稍後再試',
  'SESSION_EXPIRED': '登入已過期，請重新登入',
  'UNAUTHORIZED': '您沒有權限執行此操作',
  'NOT_FOUND': '找不到指定的資料',
  // ... 更多錯誤訊息
}
```

## 伺服器端錯誤處理

### 使用錯誤處理工具

```typescript
import {
  createValidationError,
  createNotFoundError,
  createForbiddenError,
  validateRequired,
  validateEmail,
  handleUncaughtError
} from '~/server/utils/error-helpers'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // 驗證必填欄位
    validateRequired(body, ['username', 'email', 'password'])

    // 驗證 Email
    if (!validateEmail(body.email)) {
      throw createValidationError('請輸入有效的 Email 地址')
    }

    // 檢查資源是否存在
    const user = await findUser(id)
    if (!user) {
      throw createNotFoundError('使用者')
    }

    // 檢查權限
    if (!hasPermission(currentUser, 'users:write')) {
      throw createForbiddenError()
    }

    // ... 業務邏輯

  } catch (error) {
    handleUncaughtError(error, '操作失敗')
  }
})
```

### 標準錯誤函數

#### createValidationError
```typescript
createValidationError('請填寫所有必填欄位', {
  username: '此欄位為必填',
  email: '無效的 Email 格式'
})
```

#### createNotFoundError
```typescript
createNotFoundError('使用者')  // "找不到指定的使用者"
```

#### createForbiddenError
```typescript
createForbiddenError()  // "您沒有權限執行此操作"
createForbiddenError('只有管理員可以執行此操作')
```

#### createAlreadyExistsError
```typescript
createAlreadyExistsError('帳號')  // "帳號已存在"
```

### 錯誤代碼

使用標準化的錯誤代碼:

```typescript
import { ERROR_CODES } from '~/server/utils/error-helpers'

throw createStandardError(
  409,
  '此帳號已被使用',
  ERROR_CODES.USERNAME_EXISTS
)
```

可用的錯誤代碼:
- `INVALID_CREDENTIALS` - 無效的憑證
- `ACCOUNT_LOCKED` - 帳號被鎖定
- `VALIDATION_ERROR` - 驗證錯誤
- `NOT_FOUND` - 資源不存在
- `ALREADY_EXISTS` - 資源已存在
- `USERNAME_EXISTS` - 帳號已存在
- `EMAIL_EXISTS` - Email 已存在
- `FORBIDDEN` - 禁止存取
- `SERVER_ERROR` - 伺服器錯誤
- `DATABASE_ERROR` - 資料庫錯誤

## 全域錯誤頁面

系統自動處理以下錯誤:

### 404 - 找不到頁面
顯示友好的「找不到頁面」訊息,提供重新整理和返回首頁按鈕。

### 401 - 需要登入
顯示「需要登入」訊息,提供前往登入頁按鈕。

### 403 - 存取被拒絕
顯示「存取被拒絕」訊息。

### 500 - 伺服器錯誤
顯示「伺服器錯誤」訊息,在開發環境顯示詳細錯誤堆疊。

## 全域錯誤處理 Plugin

系統自動捕獲未處理的錯誤:

### Vue 錯誤
```typescript
// 自動捕獲 Vue 元件中的錯誤
nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
  // 在開發環境記錄詳細資訊
  // 在生產環境顯示友好訊息
}
```

### 未捕獲的 Promise 拒絕
```typescript
// 自動捕獲未處理的 Promise 錯誤
window.addEventListener('unhandledrejection', (event) => {
  // 顯示友好的錯誤訊息
})
```

## 最佳實踐

### 1. 使用標準化錯誤函數
❌ 不好的做法:
```typescript
throw createError({
  statusCode: 404,
  message: '找不到資料'
})
```

✅ 好的做法:
```typescript
throw createNotFoundError('使用者')
```

### 2. 提供有意義的錯誤訊息
❌ 不好的做法:
```typescript
throw createError({ statusCode: 400, message: '錯誤' })
```

✅ 好的做法:
```typescript
throw createValidationError('請輸入有效的 Email 地址', {
  email: '無效的 Email 格式'
})
```

### 3. 使用 handleUncaughtError 處理未知錯誤
❌ 不好的做法:
```typescript
} catch (error) {
  console.error(error)
  throw createError({
    statusCode: 500,
    message: '錯誤'
  })
}
```

✅ 好的做法:
```typescript
} catch (error) {
  handleUncaughtError(error, '建立使用者時發生錯誤')
}
```

### 4. 在前端使用 tryAsync
❌ 不好的做法:
```typescript
try {
  const response = await api.post('/api/admin/users', data)
  toast.add({ title: '成功', color: 'green' })
} catch (error) {
  console.error(error)
  toast.add({ title: '失敗', color: 'red' })
}
```

✅ 好的做法:
```typescript
const { data, error } = await tryAsync(
  () => api.post('/api/admin/users', userData),
  { showToast: true }
)
```

### 5. 表單驗證
❌ 不好的做法:
```typescript
if (!email.includes('@')) {
  toast.add({ title: 'Email 格式錯誤', color: 'red' })
  return
}
```

✅ 好的做法:
```typescript
const validation = validateField(email, { required: true, email: true })
if (!validation.valid) {
  formErrors.email = validation.message
  return
}
```

## HTTP 狀態碼使用指南

- `400` - 請求格式錯誤或資料驗證失敗
- `401` - 未授權,需要登入
- `403` - 禁止存取,沒有權限
- `404` - 資源不存在
- `409` - 資源衝突,通常用於資源已存在
- `422` - 語意驗證失敗
- `429` - 請求過於頻繁
- `500` - 伺服器內部錯誤
- `503` - 服務暫時無法使用

## 開發環境 vs 生產環境

### 開發環境
- 顯示詳細的錯誤堆疊
- 記錄完整的錯誤資訊到控制台
- 顯示原始錯誤訊息

### 生產環境
- 只顯示友好的錯誤訊息
- 隱藏敏感的錯誤詳情
- 可整合第三方錯誤追蹤服務 (如 Sentry)

## 未來改進

1. **整合 Sentry** - 自動收集和追蹤錯誤
2. **錯誤分析** - 統計常見錯誤類型
3. **使用者回報** - 讓使用者可以回報錯誤
4. **錯誤重試機制** - 對於暫時性錯誤自動重試
5. **離線處理** - 改善網路錯誤的處理
