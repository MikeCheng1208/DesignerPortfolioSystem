/**
 * Admin API Composable
 * 統一的 API 請求處理，包含錯誤處理和 toast 通知
 */

interface UseAdminAPIOptions {
  showSuccessToast?: boolean
  successMessage?: string
  showErrorToast?: boolean
  errorMessage?: string
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
      showSuccessToast = false,
      successMessage = '操作成功',
      showErrorToast = true,
      errorMessage = '操作失敗'
    } = apiOptions

    try {
      const response = await $fetch<T>(url, {
        ...options,
        credentials: 'include'
      })

      if (showSuccessToast) {
        toast.add({
          title: successMessage,
          color: 'green',
          icon: 'i-heroicons-check-circle'
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
          color: 'red',
          icon: 'i-heroicons-x-circle'
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
   * GET 請求
   */
  const get = <T = any>(url: string, options: UseAdminAPIOptions = {}): Promise<T> => {
    return request<T>(url, { method: 'GET' }, options)
  }

  /**
   * POST 請求
   */
  const post = <T = any>(
    url: string,
    body?: any,
    options: UseAdminAPIOptions = {}
  ): Promise<T> => {
    return request<T>(url, { method: 'POST', body }, options)
  }

  /**
   * PUT 請求
   */
  const put = <T = any>(
    url: string,
    body?: any,
    options: UseAdminAPIOptions = {}
  ): Promise<T> => {
    return request<T>(url, { method: 'PUT', body }, options)
  }

  /**
   * DELETE 請求
   */
  const del = <T = any>(url: string, options: UseAdminAPIOptions = {}): Promise<T> => {
    return request<T>(url, { method: 'DELETE' }, options)
  }

  return {
    request,
    get,
    post,
    put,
    delete: del
  }
}
