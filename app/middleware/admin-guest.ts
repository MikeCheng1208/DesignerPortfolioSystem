import { useAdminAuth } from '~/composables/admin/useAdminAuth'
/**
 * Admin Guest 中介軟體
 * 如果已登入,導向儀表板
 */

export default defineNuxtRouteMiddleware(async () => {
  const { isAuthenticated, fetchUser } = useAdminAuth()

  // 如果已經有使用者資訊,導向儀表板
  if (isAuthenticated.value) {
    return navigateTo('/admin/dashboard', {
      replace: true,
      redirectCode: 302
    })
  }

  // 嘗試從 Cookie 取得使用者資訊
  try {
    await fetchUser()
    // 成功取得使用者資訊,導向儀表板
    return navigateTo('/admin/dashboard', {
      replace: true,
      redirectCode: 302
    })
  } catch (error) {
    // 無法取得使用者資訊,允許訪問登入頁
    return
  }
})
