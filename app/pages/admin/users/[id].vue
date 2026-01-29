<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAdminAuth } from '~/composables/admin/useAdminAuth'
import { useAdminAPI } from '~/composables/admin/useAdminAPI'
import { ROLES } from '~/types/permissions'
import AdminLayout from '~/components/admin/AdminLayout.vue'

definePageMeta({
  middleware: 'admin-auth'
})

const { user, hasPermission } = useAdminAuth()
const toast = useToast()
const api = useAdminAPI()
const router = useRouter()
const route = useRoute()

// 檢查權限
if (!hasPermission('users:write')) {
  navigateTo('/admin/dashboard')
}

// 狀態管理
const isLoading = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const isResettingPassword = ref(false)
const showDeleteModal = ref(false)
const showResetPasswordModal = ref(false)
const userData = ref<any>(null)
const newPassword = ref('')

// 表單狀態
const formState = reactive({
  username: '',
  email: '',
  displayName: '',
  role: 'editor' as 'super_admin' | 'admin' | 'editor',
  isActive: true
})

// 角色選項
const roleOptions = [
  { label: 'Super Admin - 最高權限', value: 'super_admin' },
  { label: 'Admin - 一般管理員', value: 'admin' },
  { label: 'Editor - 編輯者', value: 'editor' }
]

// 選中的角色資訊
const selectedRoleInfo = computed(() => {
  return ROLES[formState.role]
})

/**
 * 載入使用者資料
 */
const loadUser = async () => {
  isLoading.value = true

  try {
    const id = route.params.id as string
    const response = await api.get(`/api/admin/users/${id}`)
    userData.value = response.user

    // 填充表單
    formState.username = userData.value.username
    formState.email = userData.value.email
    formState.displayName = userData.value.displayName
    formState.role = userData.value.role
    formState.isActive = userData.value.isActive
  } catch (error) {
    console.error('載入使用者失敗:', error)
    toast.add({
      title: '載入失敗',
      description: '無法載入使用者資料',
      color: 'error'
    })
    router.push('/admin/users')
  } finally {
    isLoading.value = false
  }
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
 * 提交表單
 */
const handleSubmit = async () => {
  isSaving.value = true

  try {
    const id = route.params.id as string
    await api.put(
      `/api/admin/users/${id}`,
      formState,
      {
        showSuccessToast: true,
        successMessage: '使用者更新成功'
      }
    )

    // 重新載入資料
    await loadUser()
  } catch (error) {
    console.error('更新使用者失敗:', error)
  } finally {
    isSaving.value = false
  }
}

/**
 * 重置密碼
 */
const resetPassword = async () => {
  if (!newPassword.value || newPassword.value.length < 8) {
    toast.add({
      title: '驗證失敗',
      description: '密碼至少需要 8 個字元',
      color: 'error'
    })
    return
  }

  isResettingPassword.value = true

  try {
    const id = route.params.id as string
    await api.post(
      `/api/admin/users/${id}/reset-password`,
      { password: newPassword.value },
      {
        showSuccessToast: true,
        successMessage: '密碼重置成功'
      }
    )

    showResetPasswordModal.value = false
    newPassword.value = ''
  } catch (error) {
    console.error('重置密碼失敗:', error)
  } finally {
    isResettingPassword.value = false
  }
}

/**
 * 確認刪除
 */
const confirmDelete = () => {
  showDeleteModal.value = true
}

/**
 * 刪除使用者
 */
const deleteUser = async () => {
  isDeleting.value = true

  try {
    const id = route.params.id as string
    await api.delete(
      `/api/admin/users/${id}`,
      {
        showSuccessToast: true,
        successMessage: '使用者已刪除'
      }
    )

    router.push('/admin/users')
  } catch (error) {
    console.error('刪除使用者失敗:', error)
  } finally {
    isDeleting.value = false
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
  loadUser()
})
</script>

<template>
  <AdminLayout
    :page-title="isLoading ? '載入中...' : `編輯使用者:${userData?.displayName || ''}`"
    page-description="編輯後台使用者帳號資訊"
  >
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <UIcon name="i-heroicons-arrow-path" class="loading-icon" />
      <p>載入使用者資料中...</p>
    </div>

    <!-- Form -->
    <div v-else-if="userData" class="edit-container">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <NuxtLink to="/admin/users" class="back-button">
          <UIcon name="i-heroicons-arrow-left" />
          返回列表
        </NuxtLink>
        <button
          v-if="hasPermission('users:write')"
          class="reset-password-button"
          @click="showResetPasswordModal = true"
        >
          <UIcon name="i-heroicons-key" />
          重置密碼
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="form-card">
        <!-- 基本資訊 -->
        <div class="form-section">
          <h3 class="section-title">基本資訊</h3>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">
                帳號 <span class="required">*</span>
              </label>
              <input
                v-model="formState.username"
                type="text"
                class="form-input"
                :disabled="isSaving"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                顯示名稱 <span class="required">*</span>
              </label>
              <input
                v-model="formState.displayName"
                type="text"
                class="form-input"
                :disabled="isSaving"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              Email <span class="required">*</span>
            </label>
            <input
              v-model="formState.email"
              type="email"
              class="form-input"
              :disabled="isSaving"
            />
          </div>
        </div>

        <div class="form-divider"></div>

        <!-- 角色和權限 -->
        <div class="form-section">
          <h3 class="section-title">角色和權限</h3>

          <div class="form-group">
            <label class="form-label">
              角色 <span class="required">*</span>
            </label>
            <select v-model="formState.role" class="form-select" :disabled="isSaving">
              <option
                v-for="option in roleOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Role Description -->
          <div v-if="selectedRoleInfo" :class="['role-alert', getRoleClass(formState.role)]">
            <div class="role-alert-header">
              <UIcon name="i-heroicons-information-circle" />
              <strong>{{ selectedRoleInfo.name }}</strong>
            </div>
            <p class="role-alert-description">{{ selectedRoleInfo.description }}</p>
          </div>

          <!-- Permissions Preview -->
          <div v-if="selectedRoleInfo" class="permissions-preview">
            <p class="permissions-title">此角色擁有的權限:</p>
            <div class="permissions-badges">
              <span
                v-for="permission in selectedRoleInfo.permissions"
                :key="permission"
                class="permission-badge"
              >
                {{ permission }}
              </span>
            </div>
          </div>
        </div>

        <div class="form-divider"></div>

        <!-- 狀態設定 -->
        <div class="form-section">
          <h3 class="section-title">狀態設定</h3>

          <div class="form-group">
            <label class="form-label">帳號狀態</label>
            <div class="toggle-group">
              <label class="switch">
                <input type="checkbox" v-model="formState.isActive" :disabled="isSaving" />
                <span class="slider"></span>
              </label>
              <span class="toggle-text">
                {{ formState.isActive ? '啟用' : '停用' }}
              </span>
            </div>
          </div>
        </div>

        <div class="form-divider"></div>

        <!-- 其他資訊 -->
        <div class="info-section">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">最後登入:</span>
              <span class="info-value">{{ userData.lastLoginAt ? formatDate(userData.lastLoginAt) : '未登入' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">建立時間:</span>
              <span class="info-value">{{ formatDate(userData.createdAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">更新時間:</span>
              <span class="info-value">{{ formatDate(userData.updatedAt) }}</span>
            </div>
            <div v-if="userData.createdBy" class="info-item">
              <span class="info-label">建立者:</span>
              <span class="info-value">{{ userData.createdBy }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button
            v-if="hasPermission('users:delete') && userData._id !== user?._id"
            type="button"
            class="delete-action-button"
            @click="confirmDelete"
            :disabled="isSaving"
          >
            <UIcon name="i-heroicons-trash" />
            刪除使用者
          </button>
          <div v-else></div>

          <div class="action-buttons">
            <NuxtLink to="/admin/users" class="cancel-button">
              取消
            </NuxtLink>
            <button type="submit" class="submit-button" :disabled="isSaving">
              {{ isSaving ? '儲存中...' : '儲存變更' }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Reset Password Modal -->
    <div v-if="showResetPasswordModal" class="modal-overlay" @click.self="showResetPasswordModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>重置密碼</h3>
        </div>

        <div class="modal-body">
          <p class="modal-description">
            為使用者「<strong>{{ userData?.displayName }}</strong>」設定新密碼。
          </p>

          <div class="form-group">
            <label class="form-label">
              新密碼 <span class="required">*</span>
            </label>
            <input
              v-model="newPassword"
              type="password"
              class="form-input"
              placeholder="••••••••"
              :disabled="isResettingPassword"
            />
            <p class="form-help">至少 8 字元,包含大小寫字母和數字</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-button" @click="showResetPasswordModal = false">
            取消
          </button>
          <button
            class="submit-button"
            :disabled="isResettingPassword"
            @click="resetPassword"
          >
            {{ isResettingPassword ? '重置中...' : '重置密碼' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>確認刪除</h3>
        </div>

        <div class="modal-body">
          <p class="delete-message">
            確定要刪除使用者「<strong>{{ userData?.displayName }}</strong>」嗎?此操作無法復原。
          </p>
        </div>

        <div class="modal-footer">
          <button class="cancel-button" @click="showDeleteModal = false">
            取消
          </button>
          <button
            class="delete-button"
            :disabled="isDeleting"
            @click="deleteUser"
          >
            {{ isDeleting ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.edit-container {
  max-width: 100%;
  margin: 0 auto;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.back-button, .reset-password-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border: none;
}

.back-button {
  background: white;
  border: 1px solid #e5e7eb;
  color: #64748b;
}

.back-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.reset-password-button {
  background: #dbeafe;
  border: 1px solid #93c5fd;
  color: #1e40af;
}

.reset-password-button:hover {
  background: #bfdbfe;
  border-color: #60a5fa;
}

/* Form Card */
.form-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 32px;
}

@media (max-width: 768px) {
  .form-card {
    padding: 24px;
  }
}

.form-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.form-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 24px 0;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.form-input, .form-select {
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

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled, .form-select:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-help {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .form-grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}

/* Role Alert */
.role-alert {
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.role-super-admin {
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.role-admin {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
}

.role-editor {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.role-default {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
}

.role-alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.role-super-admin .role-alert-header {
  color: #991b1b;
}

.role-admin .role-alert-header {
  color: #1e40af;
}

.role-editor .role-alert-header {
  color: #166534;
}

.role-alert-description {
  font-size: 14px;
  margin: 0;
}

.role-super-admin .role-alert-description {
  color: #7f1d1d;
}

.role-admin .role-alert-description {
  color: #1e3a8a;
}

.role-editor .role-alert-description {
  color: #14532d;
}

/* Permissions Preview */
.permissions-preview {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
}

.permissions-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 12px 0;
}

.permissions-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-badge {
  padding: 6px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Toggle */
.toggle-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.toggle-text {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
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
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
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

/* Info Section */
.info-section {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  font-size: 14px;
}

@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.info-item {
  display: flex;
  gap: 8px;
}

.info-label {
  color: #64748b;
  white-space: nowrap;
}

.info-value {
  font-weight: 600;
  color: #0f172a;
}

/* Form Actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

@media (min-width: 640px) {
  .form-actions {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.delete-action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-action-button:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #fca5a5;
}

.delete-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
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
  text-decoration: none;
  display: inline-block;
}

.cancel-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.submit-button {
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

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Modal */
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
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
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

.modal-body {
  padding: 24px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.modal-description {
  font-size: 15px;
  color: #475569;
  margin: 0 0 20px 0;
}

.modal-description strong {
  color: #0f172a;
}

.delete-message {
  font-size: 15px;
  color: #475569;
  margin: 0;
}

.delete-message strong {
  color: #0f172a;
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
</style>
