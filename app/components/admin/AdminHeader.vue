<script setup lang="ts">
import { useAdminAuth } from '~/composables/admin/useAdminAuth'

interface Props {
  pageTitle?: string
  pageDescription?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: '儀表板',
  pageDescription: ''
})

const { user, logout } = useAdminAuth()
const toast = useToast()

/**
 * 登出處理
 */
const handleLogout = async () => {
  try {
    await logout()
    toast.add({
      title: '已登出',
      description: '您已成功登出系統',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
    navigateTo('/admin/login')
  } catch (error) {
    toast.add({
      title: '登出失敗',
      description: '登出時發生錯誤',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  }
}

/**
 * 前往前台
 */
const goToWebsite = () => {
  window.open('/', '_blank')
}
</script>

<template>
  <header class="admin-header">
    <!-- Page Title -->
    <div class="header-title">
      <h1>{{ pageTitle }}</h1>
      <p v-if="pageDescription">{{ pageDescription }}</p>
    </div>

    <!-- Actions -->
    <div class="header-actions">
      <!-- Website Link -->
      <button class="header-button website-button" @click="goToWebsite">
        <UIcon name="i-heroicons-globe-alt" />
        <span class="action-label">前台網站</span>
      </button>

      <!-- Logout -->
      <button class="header-button logout-button" @click="handleLogout">
        <UIcon name="i-heroicons-arrow-right-on-rectangle" />
        <span class="action-label">登出</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  height: 72px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.header-title p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Header Buttons */
.header-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.website-button {
  background: white;
  border: 1px solid #e5e7eb;
  color: #64748b;
}

.website-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #475569;
}

.logout-button {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.logout-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.logout-button:active {
  transform: translateY(0);
}

.action-label {
  white-space: nowrap;
}

@media (max-width: 768px) {
  .admin-header {
    padding: 0 1rem;
    height: 64px;
  }

  .header-title h1 {
    font-size: 1.25rem;
  }

  .header-title p {
    display: none;
  }

  .header-actions {
    gap: 8px;
  }

  .header-button {
    padding: 8px 12px;
  }

  .action-label {
    display: none;
  }
}
</style>
