/**
 * Admin 認證 Composable
 * 管理登入、登出和使用者狀態
 */

import type { AdminUserResponse } from '~/types/database'

interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  message: string
  user: AdminUserResponse
}

interface MeResponse {
  success: boolean
  user: AdminUserResponse
}

export const useAdminAuth = () => {
  const user = useState<AdminUserResponse | null>('adminUser', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const isLoading = ref(false)

  /**
   * 登入
   */
  const login = async (credentials: LoginCredentials) => {
    isLoading.value = true

    try {
      const response = await $fetch<LoginResponse>('/api/admin/auth/login', {
        method: 'POST',
        body: credentials
      })

      user.value = response.user
      return response
    } catch (error: any) {
      console.error('登入失敗:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 登出
   */
  const logout = async () => {
    isLoading.value = true

    try {
      await $fetch('/api/admin/auth/logout', {
        method: 'POST'
      })

      user.value = null

      // 導向登入頁
      await navigateTo('/admin/login')
    } catch (error) {
      console.error('登出失敗:', error)
      // 即使 API 失敗也清除本地狀態
      user.value = null
      await navigateTo('/admin/login')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 取得當前使用者資訊
   */
  const fetchUser = async () => {
    isLoading.value = true

    try {
      const response = await $fetch<MeResponse>('/api/admin/auth/me')
      user.value = response.user
      return response.user
    } catch (error: any) {
      // 只有在真正的認證錯誤時才清除使用者狀態
      const isAuthError = error?.statusCode === 401 ||
                          error?.statusCode === 403 ||
                          error?.status === 401 ||
                          error?.status === 403

      if (isAuthError) {
        user.value = null
      } else {
        // 其他錯誤(如資料庫連線錯誤)不清除使用者狀態
        console.warn('⚠️ 取得使用者資訊時發生錯誤,但保留現有登入狀態:', error)
      }

      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 檢查是否有指定權限
   */
  const hasPermission = (permission: string): boolean => {
    if (!user.value) return false

    // 如果有 ALL 權限，直接通過
    if (user.value.permissions.includes('*')) {
      return true
    }

    // 檢查精確匹配
    if (user.value.permissions.includes(permission)) {
      return true
    }

    // 檢查通配符權限
    const [resource] = permission.split(':')
    const wildcardPermission = `${resource}:*`
    if (user.value.permissions.includes(wildcardPermission)) {
      return true
    }

    return false
  }

  /**
   * 檢查是否是指定角色
   */
  const hasRole = (role: string | string[]): boolean => {
    if (!user.value) return false

    if (Array.isArray(role)) {
      return role.includes(user.value.role)
    }

    return user.value.role === role
  }

  return {
    user: readonly(user),
    isAuthenticated,
    isLoading: readonly(isLoading),
    login,
    logout,
    fetchUser,
    hasPermission,
    hasRole
  }
}
