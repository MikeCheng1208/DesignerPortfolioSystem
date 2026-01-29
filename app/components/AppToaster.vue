<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'

interface Toast {
  id: string | number
  open?: boolean
  title?: string
  description?: string
  color?: 'success' | 'error' | 'warning' | 'info' | 'primary' | 'neutral'
  icon?: string
  duration?: number
}

// 使用 Nuxt 的 useState 來與 useToast 同步
const toasts = useState<Toast[]>('toasts', () => [])

// 自動移除 toast 的計時器
const timers = new Map<string | number, ReturnType<typeof setTimeout>>()

function startTimer(toast: Toast) {
  // 如果已經有計時器，跳過
  if (timers.has(toast.id)) return

  const duration = toast.duration || 3000
  if (duration > 0) {
    const timer = setTimeout(() => {
      removeToast(toast.id)
    }, duration)
    timers.set(toast.id, timer)
  }
}

function removeToast(id: string | number) {
  // 先清除計時器
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }

  // 從陣列中移除
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

// 可見的 toasts（最多顯示 5 個）
const visibleToasts = computed(() => {
  return toasts.value.filter(t => t.open !== false).slice(-5)
})

// 監聽 toasts 變化，為新的 toast 啟動計時器
watch(
  () => toasts.value.length,
  () => {
    toasts.value.forEach(toast => {
      if (toast.open !== false && !timers.has(toast.id)) {
        startTimer(toast)
      }
    })
  },
  { immediate: true }
)

// 清理計時器
onUnmounted(() => {
  timers.forEach(timer => clearTimeout(timer))
  timers.clear()
})

// 顏色樣式對應
const colorStyles = {
  success: {
    container: 'toast--success',
    iconColor: '#10b981'
  },
  error: {
    container: 'toast--error',
    iconColor: '#ef4444'
  },
  warning: {
    container: 'toast--warning',
    iconColor: '#f59e0b'
  },
  info: {
    container: 'toast--info',
    iconColor: '#3b82f6'
  },
  primary: {
    container: 'toast--primary',
    iconColor: '#6366f1'
  },
  neutral: {
    container: 'toast--neutral',
    iconColor: '#6b7280'
  }
}

function getColorStyle(color: string | undefined) {
  return colorStyles[color as keyof typeof colorStyles] || colorStyles.primary
}

// 預設圖示
const defaultIcons: Record<string, string> = {
  success: 'i-heroicons-check-circle-solid',
  error: 'i-heroicons-x-circle-solid',
  warning: 'i-heroicons-exclamation-triangle-solid',
  info: 'i-heroicons-information-circle-solid',
  primary: 'i-heroicons-bell-solid',
  neutral: 'i-heroicons-bell-solid'
}

function getIcon(toast: Toast) {
  return toast.icon || defaultIcons[toast.color || 'primary'] || defaultIcons.primary
}
</script>

<template>
  <Teleport to="body">
    <div class="toaster">
      <TransitionGroup name="toast-slide">
        <div
          v-for="toast in visibleToasts"
          :key="toast.id"
          class="toast"
          :class="getColorStyle(toast.color).container"
        >
          <!-- 圖示 -->
          <div class="toast__icon">
            <UIcon :name="getIcon(toast)" />
          </div>

          <!-- 內容 -->
          <div class="toast__content">
            <p v-if="toast.title" class="toast__title">
              {{ toast.title }}
            </p>
            <p v-if="toast.description" class="toast__description">
              {{ toast.description }}
            </p>
          </div>

          <!-- 關閉按鈕 -->
          <button
            class="toast__close"
            @click="removeToast(toast.id)"
            aria-label="關閉通知"
          >
            <UIcon name="i-heroicons-x-mark" />
          </button>

          <!-- 進度條 -->
          <div class="toast__progress" :style="{ animationDuration: `${toast.duration || 3000}ms` }" />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toaster {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 400px;
  width: calc(100% - 2.5rem);
  pointer-events: none;
}

@media (max-width: 480px) {
  .toaster {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
    width: auto;
  }
}

/* Toast 基礎樣式 */
.toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: white;
  box-shadow:
    0 20px 50px -12px rgba(0, 0, 0, 0.25),
    0 8px 20px -8px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  pointer-events: auto;
  overflow: hidden;
}

/* 顏色變體 */
.toast--success {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-left: 4px solid #10b981;
}
.toast--success .toast__icon { color: #10b981; }
.toast--success .toast__title { color: #065f46; }
.toast--success .toast__description { color: #047857; }
.toast--success .toast__progress { background: #10b981; }

.toast--error {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-left: 4px solid #ef4444;
}
.toast--error .toast__icon { color: #ef4444; }
.toast--error .toast__title { color: #991b1b; }
.toast--error .toast__description { color: #b91c1c; }
.toast--error .toast__progress { background: #ef4444; }

.toast--warning {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-left: 4px solid #f59e0b;
}
.toast--warning .toast__icon { color: #f59e0b; }
.toast--warning .toast__title { color: #92400e; }
.toast--warning .toast__description { color: #b45309; }
.toast--warning .toast__progress { background: #f59e0b; }

.toast--info {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-left: 4px solid #3b82f6;
}
.toast--info .toast__icon { color: #3b82f6; }
.toast--info .toast__title { color: #1e40af; }
.toast--info .toast__description { color: #1d4ed8; }
.toast--info .toast__progress { background: #3b82f6; }

.toast--primary {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  border-left: 4px solid #6366f1;
}
.toast--primary .toast__icon { color: #6366f1; }
.toast--primary .toast__title { color: #3730a3; }
.toast--primary .toast__description { color: #4338ca; }
.toast--primary .toast__progress { background: #6366f1; }

.toast--neutral {
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-left: 4px solid #6b7280;
}
.toast--neutral .toast__icon { color: #6b7280; }
.toast--neutral .toast__title { color: #1f2937; }
.toast--neutral .toast__description { color: #374151; }
.toast--neutral .toast__progress { background: #6b7280; }

/* 圖示 */
.toast__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast__icon :deep(svg) {
  width: 22px;
  height: 22px;
}

/* 內容 */
.toast__content {
  flex: 1;
  min-width: 0;
  padding-right: 0.5rem;
}

.toast__title {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.toast__description {
  font-size: 0.875rem;
  margin: 0.25rem 0 0;
  line-height: 1.5;
  opacity: 0.85;
}

/* 關閉按鈕 */
.toast__close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: currentColor;
  opacity: 0.4;
  transition: all 0.2s ease;
}

.toast__close:hover {
  opacity: 0.8;
  background: rgba(0, 0, 0, 0.08);
}

.toast__close :deep(svg) {
  width: 18px;
  height: 18px;
}

/* 進度條 */
.toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  transform-origin: left;
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* 動畫 */
.toast-slide-enter-active {
  animation: slide-in 0.35s cubic-bezier(0.21, 1.02, 0.73, 1);
}

.toast-slide-leave-active {
  animation: slide-out 0.25s cubic-bezier(0.06, 0.71, 0.55, 1) forwards;
}

.toast-slide-move {
  transition: transform 0.3s cubic-bezier(0.21, 1.02, 0.73, 1);
}

@keyframes slide-in {
  0% {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes slide-out {
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(30%) scale(0.9);
  }
}
</style>
