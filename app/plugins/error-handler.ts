/**
 * 全域錯誤處理 Plugin
 * 捕獲未處理的錯誤並提供友好的錯誤訊息
 */

export default defineNuxtPlugin((nuxtApp) => {
  // Vue 錯誤處理
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue Error:', error)
    console.error('Component:', instance)
    console.error('Info:', info)

    // 在開發環境顯示詳細錯誤
    if (process.dev) {
      return
    }

    // 生產環境顯示友好訊息
    const toast = useToast()
    toast.add({
      title: '發生錯誤',
      description: '抱歉，應用程式發生了一些問題。',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
      timeout: 5000
    })
  }

  // Nuxt 錯誤處理
  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error('Nuxt Vue Error:', error)

    // 在開發環境不處理
    if (process.dev) {
      return
    }

    // 記錄錯誤（未來可以發送到錯誤追蹤服務）
    logError(error, {
      component: instance?.$options?.name || 'Unknown',
      info
    })
  })

  // 處理未捕獲的 Promise 拒絕
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled Promise Rejection:', event.reason)

      // 在開發環境不處理
      if (process.dev) {
        return
      }

      const toast = useToast()
      toast.add({
        title: '操作失敗',
        description: '請稍後再試或重新整理頁面。',
        color: 'red',
        icon: 'i-heroicons-x-circle',
        timeout: 5000
      })

      // 防止瀏覽器預設錯誤處理
      event.preventDefault()
    })
  }
})

/**
 * 錯誤記錄函數
 * 未來可以整合第三方錯誤追蹤服務（如 Sentry）
 */
function logError(error: any, context: Record<string, any> = {}) {
  const errorLog = {
    message: error.message || 'Unknown error',
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: process.client ? window.location.href : '',
    userAgent: process.client ? navigator.userAgent : '',
    ...context
  }

  // 記錄到控制台
  console.error('Error Log:', errorLog)

  // TODO: 發送到錯誤追蹤服務
  // Example: Sentry.captureException(error, { contexts: { custom: context } })
}
