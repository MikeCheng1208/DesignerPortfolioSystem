<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAdminAuth } from '~/composables/admin/useAdminAuth'
import { useAdminAPI } from '~/composables/admin/useAdminAPI'
import AdminLayout from '~/components/admin/AdminLayout.vue'

definePageMeta({
  middleware: 'admin-auth'
})

const { hasPermission } = useAdminAuth()
const toast = useToast()
const api = useAdminAPI()

// 檢查權限
if (!hasPermission('projects:read')) {
  navigateTo('/admin/dashboard')
}

// 狀態管理
const isLoading = ref(false)
const projects = ref<any[]>([])
const searchQuery = ref('')
const filterStatus = ref('all')
const isTogglingPublish = reactive<Record<string, boolean>>({})
const isDeletingProject = reactive<Record<string, boolean>>({})
const showDeleteModal = ref(false)
const projectToDelete = ref<any>(null)

// 篩選選項
const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '已發布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '精選', value: 'featured' }
]

// 篩選後的作品列表
const filteredProjects = computed(() => {
  let result = projects.value

  // 搜尋
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(project =>
      project.title.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.projectId.toLowerCase().includes(query)
    )
  }

  // 狀態篩選
  if (filterStatus.value !== 'all') {
    if (filterStatus.value === 'published') {
      result = result.filter(p => p.published)
    } else if (filterStatus.value === 'draft') {
      result = result.filter(p => !p.published)
    } else if (filterStatus.value === 'featured') {
      result = result.filter(p => p.featured)
    }
  }

  return result
})

/**
 * 載入作品列表
 */
const loadProjects = async () => {
  isLoading.value = true

  try {
    const response = await api.get('/api/admin/projects')
    projects.value = response.projects
  } catch (error) {
    console.error('載入作品列表失敗:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 切換發布狀態
 */
const togglePublish = async (project: any) => {
  isTogglingPublish[project._id] = true

  try {
    await api.post(
      `/api/admin/projects/${project._id}/publish`,
      { published: project.published },
      {
        showSuccessToast: true,
        successMessage: project.published ? '作品已發布' : '作品已取消發布'
      }
    )
  } catch (error) {
    // 恢復原狀態
    project.published = !project.published
  } finally {
    isTogglingPublish[project._id] = false
  }
}

/**
 * 確認刪除
 */
const confirmDelete = (project: any) => {
  projectToDelete.value = project
  showDeleteModal.value = true
}

/**
 * 刪除作品
 */
const deleteProject = async () => {
  if (!projectToDelete.value) return

  const projectId = projectToDelete.value._id
  isDeletingProject[projectId] = true

  try {
    await api.delete(
      `/api/admin/projects/${projectId}`,
      {
        showSuccessToast: true,
        successMessage: '作品已刪除'
      }
    )

    // 從列表中移除
    projects.value = projects.value.filter(p => p._id !== projectId)

    // 關閉 Modal
    showDeleteModal.value = false
    projectToDelete.value = null
  } catch (error) {
    console.error('刪除作品失敗:', error)
  } finally {
    isDeletingProject[projectId] = false
  }
}

// 初始載入
onMounted(() => {
  loadProjects()
})
</script>

<template>
  <AdminLayout page-title="作品管理" page-description="管理所有作品集項目">
    <div class="projects-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="search-wrapper">
            <UIcon name="i-heroicons-magnifying-glass" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜尋作品標題或分類..."
            />
          </div>

          <div class="header-actions">
            <select v-model="filterStatus" class="filter-select">
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <NuxtLink
              v-if="hasPermission('projects:write')"
              to="/admin/projects/new"
              class="add-button"
            >
              <UIcon name="i-heroicons-plus" />
              新增作品
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-content">
          <UIcon name="i-heroicons-arrow-path" class="loading-icon" />
          <p class="loading-text">載入中...</p>
        </div>
      </div>

      <!-- Projects Grid -->
      <div v-else-if="filteredProjects.length > 0" class="projects-grid">
        <div v-for="project in filteredProjects" :key="project._id" class="project-card">
          <!-- Card Header -->
          <div class="card-header">
            <div class="project-info">
              <h3 class="project-title">{{ project.title }}</h3>
              <p class="project-meta">{{ project.projectId }} · {{ project.year }}</p>
            </div>
            <div class="card-actions">
              <NuxtLink :to="`/admin/projects/${project._id}`" class="icon-button edit">
                <UIcon name="i-heroicons-pencil" />
              </NuxtLink>
              <button
                v-if="hasPermission('projects:delete')"
                class="icon-button delete"
                :disabled="isDeletingProject[project._id]"
                @click="confirmDelete(project)"
              >
                <UIcon name="i-heroicons-trash" />
              </button>
            </div>
          </div>

          <!-- Card Body -->
          <div class="card-body">
            <div class="badges">
              <span class="badge category">{{ project.category }}</span>
              <span v-if="project.featured" class="badge featured">
                <UIcon name="i-heroicons-star-solid" class="badge-icon" />
                精選
              </span>
            </div>

            <div class="tags">
              <span v-for="tag in project.tags.slice(0, 4)" :key="tag" class="tag">
                {{ tag }}
              </span>
              <span v-if="project.tags.length > 4" class="tag more">
                +{{ project.tags.length - 4 }}
              </span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <span class="status-label">發布狀態:</span>
            <div class="status-control">
              <span :class="['status-badge', project.published ? 'published' : 'draft']">
                {{ project.published ? '已發布' : '草稿' }}
              </span>
              <label class="switch">
                <input
                  type="checkbox"
                  v-model="project.published"
                  :disabled="isTogglingPublish[project._id]"
                  @change="togglePublish(project)"
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <UIcon name="i-heroicons-folder-open" class="empty-icon" />
        <h3 class="empty-title">
          {{ searchQuery || filterStatus !== 'all' ? '找不到符合條件的作品' : '尚未建立任何作品' }}
        </h3>
        <p class="empty-text">
          {{ searchQuery || filterStatus !== 'all' ? '試試其他搜尋條件' : '開始建立你的第一個作品' }}
        </p>
        <NuxtLink
          v-if="hasPermission('projects:write') && !searchQuery && filterStatus === 'all'"
          to="/admin/projects/new"
          class="empty-button"
        >
          <UIcon name="i-heroicons-plus" />
          新增第一個作品
        </NuxtLink>
      </div>

      <!-- Delete Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <div class="modal-icon danger">
              <UIcon name="i-heroicons-exclamation-triangle" />
            </div>
            <h3 class="modal-title">確認刪除</h3>
          </div>

          <div class="modal-body">
            <p>確定要刪除作品「<strong>{{ projectToDelete?.title }}</strong>」嗎？</p>
            <p class="modal-hint">此操作無法復原,所有相關資料都會被永久刪除。</p>
          </div>

          <div class="modal-footer">
            <button class="button button-secondary" @click="showDeleteModal = false">
              取消
            </button>
            <button
              class="button button-danger"
              :disabled="isDeletingProject[projectToDelete?._id]"
              @click="deleteProject"
            >
              <UIcon v-if="isDeletingProject[projectToDelete?._id]" name="i-heroicons-arrow-path" class="animate-spin" />
              {{ isDeletingProject[projectToDelete?._id] ? '刪除中...' : '確認刪除' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Container */
.projects-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 20px;
  padding: 1.5rem 2rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.page-header:hover {
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-wrapper {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #94a3b8;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  color: #0f172a;
  background: white;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-shrink: 0;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #475569;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.3);
  white-space: nowrap;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.4);
}

/* Loading */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
}

.loading-content {
  text-align: center;
}

.loading-icon {
  width: 48px;
  height: 48px;
  color: #3b82f6;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

/* Projects Grid */
.projects-grid {
  display: grid;
  gap: 1.5rem;
}

.project-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.project-card:hover {
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem 1.5rem 0;
  gap: 1rem;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.01em;
}

.project-meta {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.icon-button {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.icon-button.edit:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
}

.icon-button.delete:hover:not(:disabled) {
  border-color: #ef4444;
  background: #fef2f2;
  color: #ef4444;
}

.icon-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Card Body */
.card-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.badges {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9px;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1;
}

.badge.category {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge.featured {
  background: #fef3c7;
  color: #d97706;
}

.badge-icon {
  width: 14px;
  height: 14px;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.375rem 0.75rem;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.tag.more {
  background: #e2e8f0;
  color: #475569;
  font-weight: 600;
}

/* Card Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid #f1f5f9;
}

.status-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.status-control {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 9px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.status-badge.published {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.draft {
  background: #f1f5f9;
  color: #64748b;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 20px;
  padding: 6rem 2rem;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #cbd5e1;
  margin: 0 auto 1.5rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.empty-text {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 2rem 0;
}

.empty-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border-radius: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.3);
}

.empty-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.4);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
  animation: fadeIn 0.2s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 2rem 2rem 1rem;
  text-align: center;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon.danger {
  background: #fee2e2;
  color: #dc2626;
}

.modal-icon :deep(svg) {
  width: 32px;
  height: 32px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.modal-body {
  padding: 1rem 2rem;
  text-align: center;
}

.modal-body p {
  font-size: 0.9375rem;
  color: #475569;
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.modal-body strong {
  color: #0f172a;
  font-weight: 600;
}

.modal-hint {
  font-size: 0.875rem !important;
  color: #64748b !important;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 2rem 2rem;
}

.button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.button-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
}

.button-secondary:hover {
  background: #e2e8f0;
}

.button-danger {
  background: #ef4444;
  color: white;
  box-shadow: 0 4px 12px -2px rgba(239, 68, 68, 0.3);
}

.button-danger:hover:not(:disabled) {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(239, 68, 68, 0.4);
}

.button-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: 1.25rem 1.5rem;
  }

  .header-content {
    flex-direction: column;
  }

  .search-wrapper {
    width: 100%;
  }

  .header-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .filter-select {
    flex: 1;
  }

  .add-button {
    flex: 1;
    justify-content: center;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .modal-content {
    margin: 1rem;
  }
}
</style>
