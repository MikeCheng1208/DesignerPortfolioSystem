import { useAdminAuth } from '~/composables/admin/useAdminAuth'
/**
 * Admin 認證中介軟體
 * 保護需要登入才能訪問的頁面
 */

export default defineNuxtRouteMiddleware(async (to) => {
  // 只處理 /admin 路由(排除登入頁)
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') {
    return
  }

  const { isAuthenticated, fetchUser } = useAdminAuth()

  // 如果已經有使用者資訊,直接通過
  if (isAuthenticated.value) {
    return
  }

  // 嘗試從 Cookie 取得使用者資訊
  try {
    await fetchUser()
    // 成功取得使用者資訊,允許訪問
    return
  } catch (error: any) {
    // 只有在真正的認證錯誤時才導向登入頁
    const isAuthError = error?.statusCode === 401 ||
                        error?.statusCode === 403 ||
                        error?.status === 401 ||
                        error?.status === 403

    if (isAuthError) {
      // 認證錯誤,導向登入頁
      return navigateTo('/admin/login', {
        replace: true,
        redirectCode: 302
      })
    }

    // 其他錯誤(如資料庫連線錯誤),允許繼續但會顯示錯誤
    // 不導向登入頁,避免因為臨時性錯誤而登出使用者
    console.warn('⚠️ 認證檢查時發生非認證錯誤:', error)

    // 可以選擇顯示錯誤訊息給使用者
    // 但不強制登出
    return
  }
})
