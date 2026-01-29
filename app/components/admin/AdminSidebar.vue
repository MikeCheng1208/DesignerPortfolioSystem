<script setup lang="ts">
import { computed } from 'vue'
import { useAdminAuth } from '~/composables/admin/useAdminAuth'

const { user, hasPermission } = useAdminAuth()
const route = useRoute()

/**
 * 導航連結
 */
const navigationLinks = computed(() => {
  const links = [
    {
      label: '儀表板',
      icon: 'i-heroicons-home',
      to: '/admin/dashboard'
    },
    {
      label: '網站設定',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/admin/site-settings',
      show: hasPermission('profile:write')
    },
    {
      label: '個人資料',
      icon: 'i-heroicons-user-circle',
      to: '/admin/profile',
      show: hasPermission('profile:read')
    },
    {
      label: '作品管理',
      icon: 'i-heroicons-briefcase',
      to: '/admin/projects',
      show: hasPermission('projects:read')
    },
    {
      label: '技能管理',
      icon: 'i-heroicons-star',
      to: '/admin/skills',
      show: hasPermission('skills:read')
    },
    {
      label: '聯絡資訊',
      icon: 'i-heroicons-envelope',
      to: '/admin/contact',
      show: hasPermission('contact:read')
    },
    {
      label: '使用者管理',
      icon: 'i-heroicons-users',
      to: '/admin/users',
      show: hasPermission('users:read')
    }
  ]

  return links.filter(link => link.show !== false)
})

/**
 * 取得使用者名稱縮寫
 */
const getUserInitials = (name?: string): string => {
  if (!name) return '?'
  const names = name.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return name.substring(0, 2)
}

/**
 * 檢查連結是否活躍
 */
const isActive = (path: string) => {
  if (path === '/admin/dashboard') {
    return route.path === path
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="sidebar">
    <!-- Logo Section -->
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="logo-text">
          <h1>Admin</h1>
          <span>Portal</span>
        </div>
      </div>
    </div>

    <!-- Navigation Links -->
    <nav class="sidebar-nav">
      <NuxtLink
        v-for="link in navigationLinks"
        :key="link.to"
        :to="link.to"
        class="nav-link"
        :class="{ 'active': isActive(link.to) }"
      >
        <UIcon :name="link.icon" class="nav-icon" />
        <span class="nav-label">{{ link.label }}</span>
      </NuxtLink>
    </nav>

    <!-- User Section -->
    <div class="sidebar-user">
      <div class="user-avatar">
        <div class="avatar-circle">
          {{ getUserInitials(user?.displayName) }}
        </div>
      </div>
      <div class="user-info">
        <p class="user-name">{{ user?.displayName }}</p>
        <p class="user-email">{{ user?.email }}</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  left: 0;
}

/* Logo Section */
.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.3);
}

.logo-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.logo-text h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.logo-text span {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: #cbd5e1;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-link.active {
  background: rgba(59, 130, 246, 0.15);
  color: white;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0 4px 4px 0;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-link.active .nav-icon {
  color: #60a5fa;
}

.nav-label {
  flex: 1;
}

/* User Section */
.sidebar-user {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.3);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-email {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Scrollbar Styling */
.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
  }

  .logo-text span {
    display: none;
  }
}
</style>
