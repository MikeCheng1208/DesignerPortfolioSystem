<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true
  }
})

// 是否為開發環境
const isDevelopment = process.dev

// 錯誤類型
const errorType = computed(() => {
  const statusCode = props.error.statusCode || 500

  if (statusCode === 404) return 'not-found'
  if (statusCode === 403) return 'forbidden'
  if (statusCode === 401) return 'unauthorized'
  if (statusCode >= 500) return 'server-error'
  return 'client-error'
})

// 錯誤樣式類別
const errorTypeClass = computed(() => {
  switch (errorType.value) {
    case 'not-found':
      return 'bg-amber-100 text-amber-600'
    case 'forbidden':
    case 'unauthorized':
      return 'bg-red-100 text-red-600'
    case 'server-error':
      return 'bg-purple-100 text-purple-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
})

// 錯誤圖示
const errorIcon = computed(() => {
  switch (errorType.value) {
    case 'not-found':
      return 'i-heroicons-question-mark-circle'
    case 'forbidden':
    case 'unauthorized':
      return 'i-heroicons-lock-closed'
    case 'server-error':
      return 'i-heroicons-exclamation-triangle'
    default:
      return 'i-heroicons-x-circle'
  }
})

// 錯誤標題
const errorTitle = computed(() => {
  const statusCode = props.error.statusCode || 500

  switch (statusCode) {
    case 404:
      return '找不到頁面'
    case 403:
      return '存取被拒絕'
    case 401:
      return '需要登入'
    case 500:
      return '伺服器錯誤'
    default:
      return `錯誤 ${statusCode}`
  }
})

// 錯誤訊息
const errorMessage = computed(() => {
  const statusCode = props.error.statusCode || 500

  // 使用自訂錯誤訊息(如果有)
  if (props.error.message && !isDevelopment) {
    return props.error.message
  }

  // 預設訊息
  switch (statusCode) {
    case 404:
      return '抱歉,您要找的頁面不存在或已被移除。'
    case 403:
      return '您沒有權限存取此頁面。'
    case 401:
      return '請先登入以繼續使用。'
    case 500:
      return '伺服器發生錯誤,請稍後再試。'
    default:
      return '發生了一些問題,請稍後再試。'
  }
})

// 按鈕文字
const actionButtonText = computed(() => {
  const statusCode = props.error.statusCode || 500

  if (statusCode === 404) return '重新整理'
  if (statusCode === 401) return '前往登入'
  return '重試'
})

// 處理錯誤
const handleError = () => {
  const statusCode = props.error.statusCode || 500

  // 401 導向登入頁
  if (statusCode === 401) {
    const route = useRoute()
    // 如果在 admin 路由下,導向 admin 登入
    if (route.path.startsWith('/admin')) {
      navigateTo('/admin/login')
    } else {
      navigateTo('/')
    }
    return
  }

  // 其他情況清除錯誤並重新整理
  clearError({ redirect: '/' })
}

// SEO
useHead({
  title: `${errorTitle.value} | 李松年的作品集`
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <UCard>
        <!-- Error Icon -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            :class="errorTypeClass">
            <UIcon :name="errorIcon" class="w-8 h-8" />
          </div>
          <h1 class="text-3xl font-bold text-slate-900 mb-2">
            {{ errorTitle }}
          </h1>
          <p class="text-lg text-slate-600">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Error Details (Development only) -->
        <div v-if="isDevelopment && error.stack" class="mb-6">
          <UAlert
            color="red"
            variant="soft"
            title="錯誤詳情 (僅開發模式顯示)"
            :description="error.message"
          />
          <details class="mt-4">
            <summary class="text-sm font-medium text-slate-700 cursor-pointer hover:text-slate-900">
              查看堆疊追蹤
            </summary>
            <pre class="mt-2 text-xs bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto max-h-64">{{ error.stack }}</pre>
          </details>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <UButton
            color="primary"
            size="lg"
            block
            icon="i-heroicons-arrow-path"
            @click="handleError"
          >
            {{ actionButtonText }}
          </UButton>
          <UButton
            color="gray"
            variant="ghost"
            size="lg"
            block
            icon="i-heroicons-home"
            to="/"
          >
            返回首頁
          </UButton>
        </div>

        <!-- Help Text -->
        <div class="mt-6 text-center">
          <p class="text-sm text-slate-500">
            如果問題持續發生,請
            <a href="mailto:support@example.com" class="text-primary-600 hover:text-primary-700 underline">
              聯絡我們
            </a>
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
