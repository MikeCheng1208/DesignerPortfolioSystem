<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAdminAuth } from '~/composables/admin/useAdminAuth'
import { useAdminAPI } from '~/composables/admin/useAdminAPI'
import AdminLayout from '~/components/admin/AdminLayout.vue'

definePageMeta({
  middleware: 'admin-auth'
})

const { user, hasPermission } = useAdminAuth()
const toast = useToast()
const api = useAdminAPI()

// 檢查權限
if (!hasPermission('users:read')) {
  navigateTo('/admin/dashboard')
}

// 狀態管理
const isLoading = ref(false)
const users = ref<any[]>([])
const searchQuery = ref('')
const isDeletingUser = reactive<Record<string, boolean>>({})
const showDeleteModal = ref(false)
const userToDelete = ref<any>(null)

// 篩選後的使用者列表
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value
  }

  const query = searchQuery.value.toLowerCase()
  return users.value.filter(u =>
    u.displayName.toLowerCase().includes(query) ||
    u.username.toLowerCase().includes(query) ||
    u.email.toLowerCase().includes(query)
  )
})

/**
 * 載入使用者列表
 */
const loadUsers = async () => {
  isLoading.value = true

  try {
    const response = await api.get('/api/admin/users')
    users.value = response.users
  } catch (error) {
    console.error('載入使用者列表失敗:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 確認刪除
 */
const confirmDelete = (u: any) => {
  userToDelete.value = u
  showDeleteModal.value = true
}

/**
 * 刪除使用者
 */
const deleteUser = async () => {
  if (!userToDelete.value) return

  const userId = userToDelete.value._id
  isDeletingUser[userId] = true

  try {
    await api.delete(
      `/api/admin/users/${userId}`,
      {
        showSuccessToast: true,
        successMessage: '使用者已刪除'
      }
    )

    // 從列表中移除
    users.value = users.value.filter(u => u._id !== userId)

    // 關閉 Modal
    showDeleteModal.value = false
    userToDelete.value = null
  } catch (error) {
    console.error('刪除使用者失敗:', error)
  } finally {
    isDeletingUser[userId] = false
  }
}

/**
 * 取得使用者名稱縮寫
 */
const getUserInitials = (name: string): string => {
  if (!name) return '?'
  const names = name.split(' ')
  if (names.length >= 2) {
    return names[0][0] + names[1][0]
  }
  return name.substring(0, 2)
}

/**
 * 取得角色顏色類別
 */
const getRoleClass = (role: string) => {
  switch (role) {
    case 'super_admin':
      return 'role-super-admin'
    case 'admin':
      return 'role-admin'
    case 'editor':
      return 'role-editor'
    default:
      return 'role-default'
  }
}

/**
 * 取得角色標籤
 */
const getRoleLabel = (role: string) => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin'
    case 'admin':
      return 'Admin'
    case 'editor':
      return 'Editor'
    default:
      return role
  }
}

/**
 * 格式化日期
 */
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始載入
onMounted(() => {
  loadUsers()
})
</script>

<template>
  <AdminLayout page-title="使用者管理" page-description="管理後台使用者帳號">
    <div class="users-container">
      <!-- Actions Bar -->
      <div class="actions-bar">
        <!-- Search -->
        <div class="search-wrapper">
          <UIcon name="i-heroicons-magnifying-glass" class="search-icon" />
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜尋使用者名稱或帳號..."
          />
        </div>

        <!-- Add Button -->
        <NuxtLink
          v-if="hasPermission('users:write')"
          to="/admin/users/new"
          class="add-button"
        >
          <UIcon name="i-heroicons-plus" />
          新增使用者
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <UIcon name="i-heroicons-arrow-path" class="loading-icon" />
        <p>載入中...</p>
      </div>

      <!-- Users Grid -->
      <div v-else-if="filteredUsers.length > 0" class="users-grid">
        <div
          v-for="row in filteredUsers"
          :key="row._id"
          class="user-card"
        >
          <div class="user-card-content">
            <!-- Avatar -->
            <div class="avatar">
              <span>{{ getUserInitials(row.displayName) }}</span>
            </div>

            <!-- Content -->
            <div class="user-info">
              <div class="user-header">
                <div class="user-title-section">
                  <div class="user-title-row">
                    <h3 class="user-name">{{ row.displayName }}</h3>
                    <span :class="['role-badge', getRoleClass(row.role)]">
                      {{ getRoleLabel(row.role) }}
                    </span>
                    <span :class="['status-badge', row.isActive ? 'active' : 'inactive']">
                      {{ row.isActive ? '啟用' : '停用' }}
                    </span>
                  </div>
                  <p class="username">@{{ row.username }}</p>
                </div>

                <!-- Actions -->
                <div class="user-actions">
                  <NuxtLink :to="`/admin/users/${row._id}`" class="action-btn edit">
                    <UIcon name="i-heroicons-pencil" />
                  </NuxtLink>
                  <button
                    v-if="hasPermission('users:delete') && row._id !== user?._id"
                    class="action-btn delete"
                    :disabled="isDeletingUser[row._id]"
                    @click="confirmDelete(row)"
                  >
                    <UIcon name="i-heroicons-trash" />
                  </button>
                </div>
              </div>

              <!-- Details Grid -->
              <div class="user-details">
                <div class="detail-item">
                  <UIcon name="i-heroicons-envelope" class="detail-icon" />
                  <span class="detail-text">{{ row.email }}</span>
                </div>
                <div class="detail-item">
                  <UIcon name="i-heroicons-clock" class="detail-icon" />
                  <span class="detail-text">
                    {{ row.lastLoginAt ? formatDate(row.lastLoginAt) : '未登入' }}
                  </span>
                </div>
              </div>

              <!-- Permissions Badge -->
              <div v-if="row.permissions && row.permissions.length > 0" class="permissions-section">
                <UIcon name="i-heroicons-key" class="permissions-icon" />
                <span v-if="row.permissions.includes('*')" class="permissions-text">
                  所有權限
                </span>
                <span v-else class="permissions-text">
                  {{ row.permissions.length }} 個權限
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <UIcon name="i-heroicons-user-group" />
        </div>
        <h3 class="empty-title">
          {{ searchQuery ? '找不到符合條件的使用者' : '尚未建立任何使用者' }}
        </h3>
        <p class="empty-description">
          {{ searchQuery ? '試試其他搜尋條件' : '開始建立你的第一個使用者' }}
        </p>
        <NuxtLink
          v-if="hasPermission('users:write') && !searchQuery"
          to="/admin/users/new"
          class="add-button"
        >
          <UIcon name="i-heroicons-plus" />
          新增第一個使用者
        </NuxtLink>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <div class="modal-header warning">
          <div class="warning-icon">
            <UIcon name="i-heroicons-exclamation-triangle" />
          </div>
          <h3>確認刪除</h3>
        </div>

        <div class="modal-body">
          <p class="delete-message">
            確定要刪除使用者「<strong>{{ userToDelete?.displayName }}</strong>」嗎?
          </p>
          <p class="delete-warning">
            此操作無法復原,所有相關資料都會被永久刪除。
          </p>
        </div>

        <div class="modal-footer">
          <button
            class="cancel-button"
            @click="showDeleteModal = false"
          >
            取消
          </button>
          <button
            class="delete-button"
            :disabled="isDeletingUser[userToDelete?._id]"
            @click="deleteUser"
          >
            {{ isDeletingUser[userToDelete?._id] ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.users-container {
  max-width: 100%;
  margin: 0 auto;
}

/* Actions Bar */
.actions-bar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

@media (min-width: 640px) {
  .actions-bar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 20px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input::placeholder {
  color: #94a3b8;
}

.add-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);
  text-decoration: none;
  white-space: nowrap;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(59, 130, 246, 0.35);
}

.add-button:active {
  transform: translateY(0);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #64748b;
}

.loading-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
  color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Users Grid */
.users-grid {
  display: grid;
  gap: 16px;
}

.user-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.user-card-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

/* Avatar */
.avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
  text-transform: uppercase;
}

/* User Info */
.user-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.user-title-section {
  flex: 1;
  min-width: 0;
}

.user-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.role-super-admin {
  background: #fee2e2;
  color: #991b1b;
}

.role-admin {
  background: #dbeafe;
  color: #1e40af;
}

.role-editor {
  background: #dcfce7;
  color: #166534;
}

.role-default {
  background: #f1f5f9;
  color: #64748b;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #f1f5f9;
  color: #64748b;
}

.username {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* User Actions */
.user-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.action-btn.edit {
  color: #64748b;
}

.action-btn.edit:hover {
  background: #f1f5f9;
  color: #3b82f6;
  border-color: #3b82f6;
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* User Details */
.user-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  font-size: 14px;
}

@media (min-width: 640px) {
  .user-details {
    grid-template-columns: 1fr 1fr;
  }
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
  flex-shrink: 0;
}

.detail-text {
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Permissions Section */
.permissions-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
}

.permissions-icon {
  width: 14px;
  height: 14px;
  color: #64748b;
}

.permissions-text {
  color: #64748b;
}

/* Empty State */
.empty-state {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 32px;
  color: #94a3b8;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px 0;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.modal-header.warning {
  display: flex;
  align-items: center;
  gap: 12px;
}

.warning-icon {
  width: 40px;
  height: 40px;
  background: #fee2e2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  font-size: 20px;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button {
  padding: 10px 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.delete-button {
  padding: 10px 24px;
  background: #ef4444;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-button:hover:not(:disabled) {
  background: #dc2626;
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.delete-message {
  font-size: 15px;
  color: #475569;
  margin: 0 0 8px 0;
}

.delete-message strong {
  color: #0f172a;
}

.delete-warning {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .user-card-content {
    flex-direction: column;
  }

  .avatar {
    margin: 0 auto;
  }

  .user-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .user-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
