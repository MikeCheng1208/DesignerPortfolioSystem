<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAdminAuth } from '~/composables/admin/useAdminAuth'
import { useAdminAPI } from '~/composables/admin/useAdminAPI'
import AdminLayout from '~/components/admin/AdminLayout.vue'

definePageMeta({
  middleware: 'admin-auth'
})

const { user } = useAdminAuth()
const api = useAdminAPI()
const toast = useToast()

// 狀態管理
const isLoading = ref(false)
const isSavingSlogan = ref(false)
const stats = ref({
  projects: { total: 0, published: 0, draft: 0 },
  skills: { total: 0, visible: 0, hidden: 0 },
  users: { total: 0, active: 0, inactive: 0 }
})

// 標語表單
const sloganForm = reactive({
  heroTitle: '',
  heroSubtitle: ''
})

/**
 * 載入儀表板統計
 */
const loadDashboardStats = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/api/admin/dashboard/stats')
    stats.value = response.stats
  } catch (error) {
    console.error('載入儀表板統計失敗:', error)
    // 使用預設數據以防錯誤
    stats.value = {
      projects: { total: 0, published: 0, draft: 0 },
      skills: { total: 0, visible: 0, hidden: 0 },
      users: { total: 1, active: 1, inactive: 0 }
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * 載入首頁標語
 */
const loadSlogan = async () => {
  try {
    const response = await api.get('/api/admin/profile')
    sloganForm.heroTitle = response.profile.heroTitle || '創造有意義的\n數位體驗'
    sloganForm.heroSubtitle = response.profile.heroSubtitle || '專注於使用者體驗設計與介面創新，\n透過設計解決問題，創造價值'
  } catch (error) {
    console.error('載入首頁標語失敗:', error)
    // 設定預設值
    sloganForm.heroTitle = '創造有意義的\n數位體驗'
    sloganForm.heroSubtitle = '專注於使用者體驗設計與介面創新，\n透過設計解決問題，創造價值'
  }
}

/**
 * 儲存首頁標語
 */
const saveSlogan = async () => {
  isSavingSlogan.value = true
  try {
    await api.put('/api/admin/profile', {
      heroTitle: sloganForm.heroTitle,
      heroSubtitle: sloganForm.heroSubtitle
    }, {
      showSuccessToast: true,
      successMessage: '首頁標語已更新'
    })
  } catch (error) {
    console.error('儲存首頁標語失敗:', error)
    toast.add({
      title: '儲存失敗',
      description: '無法儲存首頁標語',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    isSavingSlogan.value = false
  }
}

onMounted(() => {
  loadDashboardStats()
  loadSlogan()
})

// 快捷操作
const quickActions = [
  {
    title: '新增作品',
    description: '建立新的作品集項目',
    icon: 'i-heroicons-plus-circle',
    to: '/admin/projects/new',
    color: 'blue'
  },
  {
    title: '管理技能',
    description: '編輯技能分類與項目',
    icon: 'i-heroicons-star',
    to: '/admin/skills',
    color: 'purple'
  },
  {
    title: '個人資料',
    description: '更新個人資訊',
    icon: 'i-heroicons-user-circle',
    to: '/admin/profile',
    color: 'green'
  },
  {
    title: '聯絡資訊',
    description: '編輯聯絡方式',
    icon: 'i-heroicons-envelope',
    to: '/admin/contact',
    color: 'orange'
  }
]
</script>

<template>
  <AdminLayout
    page-title="儀表板"
    page-description="歡迎使用後台管理系統"
  >
    <div class="dashboard">
      <!-- Welcome Section -->
      <div class="welcome-card">
        <div class="welcome-content">
          <h2>歡迎回來，{{ user?.displayName }} 👋</h2>
          <p>這是您的管理儀表板概覽</p>
        </div>
        <div class="welcome-time">
          {{ new Date().toLocaleString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
          }) }}
        </div>
      </div>

      <!-- Hero Slogan Edit -->
      <div class="slogan-section">
        <div class="section-header">
          <h3>首頁標語</h3>
          <p>設定首頁的主標題和副標題</p>
        </div>

        <form @submit.prevent="saveSlogan" class="slogan-form">
          <div class="form-group">
            <label class="form-label">
              主標語 <span class="required">*</span>
            </label>
            <textarea
              v-model="sloganForm.heroTitle"
              rows="3"
              class="form-textarea"
              placeholder="例如:&#10;創造有意義的&#10;數位體驗"
              :disabled="isSavingSlogan"
            ></textarea>
            <p class="form-hint">這段文字會顯示在首頁的醒目位置，每一行會單獨呈現並有動畫效果</p>
          </div>

          <div class="form-group">
            <label class="form-label">
              副標語 <span class="required">*</span>
            </label>
            <textarea
              v-model="sloganForm.heroSubtitle"
              rows="3"
              class="form-textarea"
              placeholder="例如:&#10;專注於使用者體驗設計與介面創新，&#10;透過設計解決問題，創造價值"
              :disabled="isSavingSlogan"
            ></textarea>
            <p class="form-hint">補充說明主標語的詳細內容，支援多行顯示</p>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="save-button"
              :disabled="isSavingSlogan"
            >
              <UIcon name="i-heroicons-check" />
              {{ isSavingSlogan ? '儲存中...' : '儲存變更' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <!-- Projects Stats -->
        <div class="stat-card">
          <div class="stat-icon blue">
            <UIcon name="i-heroicons-briefcase" />
          </div>
          <div class="stat-content">
            <h3>作品管理</h3>
            <div class="stat-number">{{ stats.projects.total }}</div>
            <div class="stat-details">
              <span class="stat-detail success">
                <UIcon name="i-heroicons-check-circle" />
                {{ stats.projects.published }} 已發布
              </span>
              <span class="stat-detail muted">
                <UIcon name="i-heroicons-document" />
                {{ stats.projects.draft }} 草稿
              </span>
            </div>
          </div>
        </div>

        <!-- Skills Stats -->
        <div class="stat-card">
          <div class="stat-icon purple">
            <UIcon name="i-heroicons-star" />
          </div>
          <div class="stat-content">
            <h3>技能分類</h3>
            <div class="stat-number">{{ stats.skills.total }}</div>
            <div class="stat-details">
              <span class="stat-detail success">
                <UIcon name="i-heroicons-eye" />
                {{ stats.skills.visible }} 可見
              </span>
              <span class="stat-detail muted">
                <UIcon name="i-heroicons-eye-slash" />
                {{ stats.skills.hidden }} 隱藏
              </span>
            </div>
          </div>
        </div>

        <!-- Users Stats -->
        <div class="stat-card">
          <div class="stat-icon green">
            <UIcon name="i-heroicons-users" />
          </div>
          <div class="stat-content">
            <h3>使用者</h3>
            <div class="stat-number">{{ stats.users.total }}</div>
            <div class="stat-details">
              <span class="stat-detail success">
                <UIcon name="i-heroicons-check-badge" />
                {{ stats.users.active }} 活躍
              </span>
              <span class="stat-detail muted">
                <UIcon name="i-heroicons-x-circle" />
                {{ stats.users.inactive }} 停用
              </span>
            </div>
          </div>
        </div>

        <!-- System Info -->
        <div class="stat-card">
          <div class="stat-icon orange">
            <UIcon name="i-heroicons-shield-check" />
          </div>
          <div class="stat-content">
            <h3>系統狀態</h3>
            <div class="stat-number">正常</div>
            <div class="stat-details">
              <span class="stat-detail success">
                <UIcon name="i-heroicons-signal" />
                運行中
              </span>
              <span class="stat-detail success">
                <UIcon name="i-heroicons-server" />
                穩定
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section">
        <div class="section-header">
          <h3>快捷操作</h3>
          <p>常用功能快速入口</p>
        </div>

        <div class="actions-grid">
          <NuxtLink
            v-for="action in quickActions"
            :key="action.to"
            :to="action.to"
            class="action-card"
            :class="action.color"
          >
            <div class="action-icon">
              <UIcon :name="action.icon" />
            </div>
            <div class="action-content">
              <h4>{{ action.title }}</h4>
              <p>{{ action.description }}</p>
            </div>
            <div class="action-arrow">
              <UIcon name="i-heroicons-arrow-right" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Welcome Card */
.welcome-card {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 8px 24px -4px rgba(59, 130, 246, 0.3);
}

.welcome-content h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.welcome-content p {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.welcome-time {
  font-size: 0.9rem;
  opacity: 0.85;
  text-align: right;
}

/* Slogan Section */
.slogan-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
}

.slogan-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input-lg {
  padding: 14px 16px;
  font-size: 18px;
  font-weight: 500;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled,
.form-textarea:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
}

.save-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

.save-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1.25rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon :deep(svg) {
  width: 28px;
  height: 28px;
  color: white;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon.purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon.green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-content h3 {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
}

.stat-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-detail {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-detail :deep(svg) {
  width: 16px;
  height: 16px;
}

.stat-detail.success {
  color: #10b981;
}

.stat-detail.muted {
  color: #94a3b8;
}

/* Section */
.section {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.section-header p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  border: 2px solid;
  text-decoration: none;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.action-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.3s;
}

.action-card:hover::before {
  opacity: 0.05;
}

.action-card:hover {
  transform: translateX(4px);
}

.action-card.blue {
  border-color: #3b82f6;
}

.action-card.blue::before {
  background: #3b82f6;
}

.action-card.blue .action-icon {
  color: #3b82f6;
}

.action-card.purple {
  border-color: #8b5cf6;
}

.action-card.purple::before {
  background: #8b5cf6;
}

.action-card.purple .action-icon {
  color: #8b5cf6;
}

.action-card.green {
  border-color: #10b981;
}

.action-card.green::before {
  background: #10b981;
}

.action-card.green .action-icon {
  color: #10b981;
}

.action-card.orange {
  border-color: #f59e0b;
}

.action-card.orange::before {
  background: #f59e0b;
}

.action-card.orange .action-icon {
  color: #f59e0b;
}

.action-icon {
  flex-shrink: 0;
}

.action-icon :deep(svg) {
  width: 32px;
  height: 32px;
}

.action-content {
  flex: 1;
  min-width: 0;
}

.action-content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.action-content p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.action-arrow {
  flex-shrink: 0;
  opacity: 0.3;
  transition: all 0.3s;
}

.action-card:hover .action-arrow {
  opacity: 1;
  transform: translateX(4px);
}

.action-arrow :deep(svg) {
  width: 20px;
  height: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .welcome-time {
    text-align: left;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
