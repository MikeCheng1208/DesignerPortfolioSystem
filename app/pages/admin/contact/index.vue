<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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
if (!hasPermission('contact:write')) {
  navigateTo('/admin/dashboard')
}

// 狀態管理
const isLoading = ref(false)
const isSaving = ref(false)
const contact = ref<any>(null)

// 表單狀態
const formState = reactive({
  text: '',
  links: [] as Array<{
    id: string
    label: string
    value: string
    url: string
    icon?: string
    order: number
  }>
})

/**
 * 載入 Contact 資料
 */
const loadContact = async () => {
  isLoading.value = true

  try {
    const response = await api.get('/api/admin/contact')
    contact.value = response.contact

    // 填充表單
    formState.text = response.contact.text
    formState.links = response.contact.links.map((link: any) => ({
      id: link.id,
      label: link.label,
      value: link.value,
      url: link.url,
      icon: link.icon || '',
      order: link.order
    }))
  } catch (error) {
    console.error('載入聯絡資訊失敗:', error)
    toast.add({
      title: '載入失敗',
      description: '無法載入聯絡資訊',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    isLoading.value = false
  }
}

/**
 * 新增連結
 */
const addLink = () => {
  formState.links.push({
    id: '',
    label: '',
    value: '',
    url: '',
    icon: '',
    order: formState.links.length
  })
}

/**
 * 移除連結
 */
const removeLink = (index: number) => {
  formState.links.splice(index, 1)
  // 重新計算 order
  formState.links.forEach((link, i) => {
    link.order = i
  })
}

/**
 * 向上移動連結
 */
const moveLinkUp = (index: number) => {
  if (index === 0) return

  const temp = formState.links[index]
  formState.links[index] = formState.links[index - 1]
  formState.links[index - 1] = temp

  // 更新 order
  formState.links.forEach((link, i) => {
    link.order = i
  })
}

/**
 * 向下移動連結
 */
const moveLinkDown = (index: number) => {
  if (index === formState.links.length - 1) return

  const temp = formState.links[index]
  formState.links[index] = formState.links[index + 1]
  formState.links[index + 1] = temp

  // 更新 order
  formState.links.forEach((link, i) => {
    link.order = i
  })
}

/**
 * 提交表單
 */
const handleSubmit = async () => {
  // 驗證
  if (!formState.text.trim()) {
    toast.add({
      title: '驗證失敗',
      description: '請輸入說明文字',
      color: 'error'
    })
    return
  }

  if (formState.links.length === 0) {
    toast.add({
      title: '驗證失敗',
      description: '請至少新增一個連結',
      color: 'error'
    })
    return
  }

  // 驗證每個連結
  for (let i = 0; i < formState.links.length; i++) {
    const link = formState.links[i]
    if (!link.id || !link.label || !link.value || !link.url) {
      toast.add({
        title: '驗證失敗',
        description: `連結 ${i + 1} 缺少必填欄位`,
        color: 'error'
      })
      return
    }
  }

  isSaving.value = true

  try {
    const response = await api.put(
      '/api/admin/contact',
      {
        text: formState.text.trim(),
        links: formState.links
      },
      {
        showSuccessToast: true,
        successMessage: '聯絡資訊更新成功'
      }
    )

    // 更新本地資料
    contact.value = response.contact
  } catch (error) {
    console.error('更新聯絡資訊失敗:', error)
  } finally {
    isSaving.value = false
  }
}

/**
 * 預覽變更
 */
const previewChanges = () => {
  // 在新分頁開啟前台網站
  window.open('/', '_blank')
}

// 初始載入
onMounted(() => {
  loadContact()
})
</script>

<template>
  <AdminLayout page-title="聯絡資訊管理" page-description="編輯聯絡說明和連結">
    <!-- Loading State -->
    <div v-if="isLoading && !contact" class="loading-container">
      <div class="loading-content">
        <UIcon name="i-heroicons-arrow-path" class="loading-icon" />
        <p class="loading-text">載入中...</p>
      </div>
    </div>

    <!-- Contact Form -->
    <div v-else class="contact-form">
      <form @submit.prevent="handleSubmit" class="form-container">
        <!-- 聯絡說明文字 -->
        <div class="form-section">
          <div class="section-header">
            <div>
              <h3 class="section-title">聯絡說明</h3>
              <p class="section-description">顯示在聯絡頁面的說明文字</p>
            </div>
          </div>

          <div class="form-field">
            <label class="field-label">
              說明文字
              <span class="required">*</span>
            </label>
            <textarea
              v-model="formState.text"
              class="field-textarea"
              placeholder="請輸入聯絡說明文字"
              rows="5"
              :disabled="isSaving"
              required
            ></textarea>
          </div>
        </div>

        <!-- 聯絡連結 -->
        <div class="form-section">
          <div class="section-header">
            <div>
              <h3 class="section-title">聯絡連結</h3>
              <p class="section-description">顯示在聯絡頁面的聯絡方式</p>
            </div>
            <button
              type="button"
              class="add-button"
              @click="addLink"
              :disabled="isSaving"
            >
              <UIcon name="i-heroicons-plus" />
              新增連結
            </button>
          </div>

          <!-- Links List -->
          <div v-if="formState.links.length > 0" class="links-list">
            <div
              v-for="(link, index) in formState.links"
              :key="index"
              class="link-card"
            >
              <!-- Order Controls -->
              <div class="order-controls">
                <button
                  type="button"
                  class="order-button"
                  :disabled="index === 0 || isSaving"
                  @click="moveLinkUp(index)"
                  title="向上移動"
                >
                  <UIcon name="i-heroicons-chevron-up" />
                </button>
                <div class="order-number">{{ index + 1 }}</div>
                <button
                  type="button"
                  class="order-button"
                  :disabled="index === formState.links.length - 1 || isSaving"
                  @click="moveLinkDown(index)"
                  title="向下移動"
                >
                  <UIcon name="i-heroicons-chevron-down" />
                </button>
              </div>

              <!-- Form Fields -->
              <div class="link-fields">
                <div class="fields-grid">
                  <!-- ID -->
                  <div class="form-field">
                    <label class="field-label">
                      ID
                      <span class="required">*</span>
                    </label>
                    <input
                      v-model="link.id"
                      type="text"
                      class="field-input"
                      placeholder="email"
                      :disabled="isSaving"
                      required
                    />
                  </div>

                  <!-- Label -->
                  <div class="form-field">
                    <label class="field-label">
                      標籤
                      <span class="required">*</span>
                    </label>
                    <input
                      v-model="link.label"
                      type="text"
                      class="field-input"
                      placeholder="Email"
                      :disabled="isSaving"
                      required
                    />
                  </div>

                  <!-- Value -->
                  <div class="form-field">
                    <label class="field-label">
                      顯示值
                      <span class="required">*</span>
                    </label>
                    <input
                      v-model="link.value"
                      type="text"
                      class="field-input"
                      placeholder="your@email.com"
                      :disabled="isSaving"
                      required
                    />
                  </div>

                  <!-- URL -->
                  <div class="form-field">
                    <label class="field-label">
                      連結
                      <span class="required">*</span>
                    </label>
                    <input
                      v-model="link.url"
                      type="text"
                      class="field-input"
                      placeholder="mailto:your@email.com"
                      :disabled="isSaving"
                      required
                    />
                  </div>

                  <!-- Icon (Full Width) -->
                  <div class="form-field full-width">
                    <label class="field-label">圖示 (選填)</label>
                    <input
                      v-model="link.icon"
                      type="text"
                      class="field-input"
                      placeholder="i-heroicons-envelope"
                      :disabled="isSaving"
                    />
                  </div>
                </div>
              </div>

              <!-- Delete Button -->
              <div class="link-actions">
                <button
                  type="button"
                  class="delete-button"
                  @click="removeLink(index)"
                  :disabled="isSaving"
                  title="刪除連結"
                >
                  <UIcon name="i-heroicons-trash" />
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state">
            <UIcon name="i-heroicons-link" class="empty-icon" />
            <p class="empty-text">尚未新增任何連結</p>
            <button
              type="button"
              class="add-button-large"
              @click="addLink"
              :disabled="isSaving"
            >
              <UIcon name="i-heroicons-plus" />
              新增第一個連結
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <div class="actions-left">
            <button
              type="button"
              class="button button-secondary"
              @click="loadContact"
              :disabled="isSaving"
            >
              <UIcon name="i-heroicons-arrow-path" />
              重置
            </button>
          </div>

          <div class="actions-right">
            <button
              type="button"
              class="button button-ghost"
              @click="previewChanges"
              :disabled="isSaving"
            >
              <UIcon name="i-heroicons-eye" />
              預覽
            </button>
            <button
              type="submit"
              class="button button-primary"
              :disabled="isSaving"
            >
              <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="animate-spin" />
              <UIcon v-else name="i-heroicons-check" />
              {{ isSaving ? '儲存中...' : '儲存變更' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

/* Form Container */
.contact-form {
  max-width: 1200px;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Form Section */
.form-section {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
}

.form-section:hover {
  box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.section-description {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Add Button */
.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px -2px rgba(59, 130, 246, 0.3);
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button-large {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.3);
}

.add-button-large:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.4);
}

/* Form Field */
.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.required {
  color: #ef4444;
}

.field-input,
.field-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  color: #0f172a;
  background: white;
  transition: all 0.3s;
}

.field-input:focus,
.field-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field-input:disabled,
.field-textarea:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.6;
}

/* Links List */
.links-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.link-card {
  display: flex;
  gap: 1.25rem;
  padding: 1.5rem;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  transition: all 0.3s;
}

.link-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05);
}

/* Order Controls */
.order-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.order-button {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;
}

.order-button:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.order-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.order-number {
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748b;
  padding: 0.25rem 0.5rem;
}

/* Link Fields */
.link-fields {
  flex: 1;
  min-width: 0;
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Link Actions */
.link-actions {
  display: flex;
  align-items: flex-start;
}

.delete-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #fee2e2;
  border-radius: 12px;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.3s;
}

.delete-button:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
  transform: scale(1.05);
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  background: #f8fafc;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 1.5rem 0;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: white;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  gap: 1rem;
}

.actions-left,
.actions-right {
  display: flex;
  gap: 0.75rem;
}

/* Buttons */
.button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.button-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px -2px rgba(59, 130, 246, 0.3);
}

.button-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(59, 130, 246, 0.4);
}

.button-primary:active:not(:disabled) {
  transform: translateY(0);
}

.button-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
}

.button-secondary:hover:not(:disabled) {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.button-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-ghost {
  background: transparent;
  color: #64748b;
  border: 2px solid transparent;
}

.button-ghost:hover:not(:disabled) {
  background: #f8fafc;
  color: #334155;
  border-color: #e2e8f0;
}

.button-ghost:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .form-section {
    padding: 1.5rem;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
  }

  .add-button {
    width: 100%;
    justify-content: center;
  }

  .link-card {
    flex-direction: column;
    padding: 1.25rem;
  }

  .order-controls {
    flex-direction: row;
    justify-content: center;
  }

  .order-button {
    order: 0;
  }

  .order-number {
    order: 1;
  }

  .fields-grid {
    grid-template-columns: 1fr;
  }

  .form-field.full-width {
    grid-column: 1;
  }

  .link-actions {
    width: 100%;
  }

  .delete-button {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
    padding: 1rem;
  }

  .actions-left,
  .actions-right {
    width: 100%;
    flex-direction: column;
  }

  .button {
    width: 100%;
    justify-content: center;
  }
}
</style>
