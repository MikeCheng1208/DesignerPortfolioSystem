/**
 * Admin API Composable
 * 統一的 API 請求處理，包含錯誤處理和 toast 通知
 */

interface UseAdminAPIOptions {
  showSuccessToast?: boolean
  successMessage?: string
  showErrorToast?: boolean
  errorMessage?: string
  /** toast 持續時間（毫秒），預設 3000 */
  toastDuration?: number
}

export const useAdminAPI = () => {
  const toast = useToast()

  /**
   * 通用 API 請求方法
   */
  const request = async <T = any>(
    url: string,
    options: any = {},
    apiOptions: UseAdminAPIOptions = {}
  ): Promise<T> => {
    const {
      showSuccessToast = true, // 預設顯示成功提示
      successMessage = '操作成功',
      showErrorToast = true,
      errorMessage = '操作失敗',
      toastDuration = 3000
    } = apiOptions

    try {
      const response = await $fetch<T>(url, {
        ...options,
        credentials: 'include'
      })

      if (showSuccessToast) {
        toast.add({
          title: '成功',
          description: successMessage,
          color: 'success',
          icon: 'i-heroicons-check-circle',
          duration: toastDuration
        })
      }

      return response
    } catch (error: any) {
      console.error('API 錯誤:', error)

      if (showErrorToast) {
        const message = error?.data?.message || error?.message || errorMessage

        toast.add({
          title: '錯誤',
          description: message,
          color: 'error',
          icon: 'i-heroicons-x-circle',
          duration: 5000 // 錯誤訊息顯示久一點
        })
      }

      // 如果是 401，導向登入頁
      if (error?.statusCode === 401 || error?.status === 401) {
        await navigateTo('/admin/login')
      }

      throw error
    }
  }

  /**
   * GET 請求（預設不顯示成功 toast）
   */
  const get = <T = any>(url: string, options: UseAdminAPIOptions = {}): Promise<T> => {
    return request<T>(url, { method: 'GET' }, { showSuccessToast: false, ...options })
  }

  /**
   * POST 請求（預設顯示成功 toast）
   */
  const post = <T = any>(
    url: string,
    body?: any,
    options: UseAdminAPIOptions = {}
  ): Promise<T> => {
    return request<T>(url, { method: 'POST', body }, { successMessage: '新增成功', ...options })
  }

  /**
   * PUT 請求（預設顯示成功 toast）
   */
  const put = <T = any>(
    url: string,
    body?: any,
    options: UseAdminAPIOptions = {}
  ): Promise<T> => {
    return request<T>(url, { method: 'PUT', body }, { successMessage: '儲存成功', ...options })
  }

  /**
   * DELETE 請求（預設顯示成功 toast）
   */
  const del = <T = any>(url: string, options: UseAdminAPIOptions = {}): Promise<T> => {
    return request<T>(url, { method: 'DELETE' }, { successMessage: '刪除成功', ...options })
  }

  return {
    request,
    get,
    post,
    put,
    delete: del
  }
}
