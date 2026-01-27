<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useAdminAuth } from '~/composables/admin/useAdminAuth'
import { useAdminAPI } from '~/composables/admin/useAdminAPI'
import { ROLES } from '~/types/permissions'
import AdminLayout from '~/components/admin/AdminLayout.vue'

definePageMeta({
  middleware: 'admin-auth'
})

const { hasPermission } = useAdminAuth()
const toast = useToast()
const api = useAdminAPI()
const router = useRouter()

// 檢查權限
if (!hasPermission('users:write')) {
  navigateTo('/admin/dashboard')
}

// 狀態管理
const isSaving = ref(false)

// 表單狀態
const formState = reactive({
  username: '',
  email: '',
  password: '',
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
 * 取得角色顏色
 */
const getRoleColor = (role: string) => {
  switch (role) {
    case 'super_admin':
      return 'red'
    case 'admin':
      return 'blue'
    case 'editor':
      return 'green'
    default:
      return 'gray'
  }
}

/**
 * 取得角色樣式
 */
const getRoleClass = (role: string) => {
  switch (role) {
    case 'super_admin':
      return 'role-alert-red'
    case 'admin':
      return 'role-alert-blue'
    case 'editor':
      return 'role-alert-green'
    default:
      return 'role-alert-gray'
  }
}

/**
 * 提交表單
 */
const handleSubmit = async () => {
  // 驗證必填欄位
  if (!formState.username || !formState.email || !formState.password || !formState.displayName) {
    toast.add({
      title: '驗證失敗',
      description: '請填寫所有必填欄位',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
    return
  }

  // 驗證 Email 格式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formState.email)) {
    toast.add({
      title: '驗證失敗',
      description: '請輸入有效的 Email 地址',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
    return
  }

  // 驗證密碼長度
  if (formState.password.length < 8) {
    toast.add({
      title: '驗證失敗',
      description: '密碼至少需要 8 個字元',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
    return
  }

  isSaving.value = true

  try {
    const response = await api.post(
      '/api/admin/users',
      formState,
      {
        showSuccessToast: true,
        successMessage: '使用者建立成功'
      }
    )

    // 導向編輯頁面
    router.push(`/admin/users/${response.user._id}`)
  } catch (error) {
    console.error('建立使用者失敗:', error)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <AdminLayout page-title="新增使用者" page-description="建立新的後台使用者帳號">
    <div class="new-user-container">
      <!-- Quick Actions -->
      <div class="quick-actions">
        <NuxtLink to="/admin/users" class="back-button">
          <UIcon name="i-heroicons-arrow-left" />
          返回列表
        </NuxtLink>
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
                placeholder="admin123"
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
                placeholder="管理員"
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
              placeholder="admin@example.com"
              :disabled="isSaving"
            />
          </div>

          <div class="form-group">
            <label class="form-label">
              密碼 <span class="required">*</span>
            </label>
            <input
              v-model="formState.password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              :disabled="isSaving"
            />
            <p class="form-hint">至少 8 字元，建議包含大小寫字母和數字</p>
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
              <option v-for="option in roleOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- Role Description -->
          <div v-if="selectedRoleInfo" class="role-alert" :class="getRoleClass(formState.role)">
            <div class="role-alert-icon">
              <UIcon name="i-heroicons-shield-check" />
            </div>
            <div class="role-alert-content">
              <h4 class="role-alert-title">{{ selectedRoleInfo.name }}</h4>
              <p class="role-alert-description">{{ selectedRoleInfo.description }}</p>
            </div>
          </div>

          <!-- Permissions Preview -->
          <div v-if="selectedRoleInfo" class="permissions-preview">
            <p class="permissions-title">此角色擁有的權限:</p>
            <div class="permissions-list">
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

        <!-- Actions -->
        <div class="form-actions">
          <NuxtLink to="/admin/users" class="cancel-button">
            取消
          </NuxtLink>
          <button
            type="submit"
            class="submit-button"
            :disabled="isSaving"
          >
            {{ isSaving ? '建立中...' : '建立使用者' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.new-user-container {
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

.back-button {
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
  background: white;
  border: 1px solid #e5e7eb;
  color: #64748b;
}

.back-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
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
  margin-bottom: 32px;
}

.form-section:last-of-type {
  margin-bottom: 0;
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
  margin: 32px 0;
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

.form-select {
  cursor: pointer;
}

.form-hint {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 6px;
  margin-bottom: 0;
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
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid;
  margin-bottom: 16px;
}

.role-alert-red {
  background: #fef2f2;
  border-color: #fecaca;
}

.role-alert-blue {
  background: #eff6ff;
  border-color: #bfdbfe;
}

.role-alert-green {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.role-alert-icon {
  flex-shrink: 0;
}

.role-alert-icon :deep(svg) {
  width: 24px;
  height: 24px;
}

.role-alert-red .role-alert-icon {
  color: #ef4444;
}

.role-alert-blue .role-alert-icon {
  color: #3b82f6;
}

.role-alert-green .role-alert-icon {
  color: #10b981;
}

.role-alert-content {
  flex: 1;
}

.role-alert-title {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.role-alert-red .role-alert-title {
  color: #991b1b;
}

.role-alert-blue .role-alert-title {
  color: #1e40af;
}

.role-alert-green .role-alert-title {
  color: #065f46;
}

.role-alert-description {
  font-size: 13px;
  margin: 0;
}

.role-alert-red .role-alert-description {
  color: #dc2626;
}

.role-alert-blue .role-alert-description {
  color: #2563eb;
}

.role-alert-green .role-alert-description {
  color: #059669;
}

/* Permissions Preview */
.permissions-preview {
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.permissions-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 12px 0;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permission-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 13px;
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

/* Form Actions */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  margin-top: 32px;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .cancel-button,
  .form-actions .submit-button {
    width: 100%;
    justify-content: center;
  }
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
</style>
