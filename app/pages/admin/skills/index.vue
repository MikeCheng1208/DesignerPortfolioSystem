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
if (!hasPermission('skills:read')) {
  navigateTo('/admin/dashboard')
}

// 狀態管理
const isLoading = ref(false)
const isSaving = ref(false)
const isReordering = ref(false)
const skills = ref<any[]>([])
const isTogglingVisibility = reactive<Record<string, boolean>>({})
const isDeletingSkill = reactive<Record<string, boolean>>({})
const showFormModal = ref(false)
const showDeleteModal = ref(false)
const skillToDelete = ref<any>(null)
const isEditing = ref(false)
const editingSkill = ref<any>(null)
const skillInput = ref('')

// 表單狀態
const formState = reactive({
  categoryId: '',
  title: '',
  skills: [] as string[],
  isVisible: true
})

/**
 * 載入技能列表
 */
const loadSkills = async () => {
  isLoading.value = true

  try {
    const response = await api.get('/api/admin/skills')
    skills.value = response.skills
  } catch (error) {
    console.error('載入技能列表失敗:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * 打開新增 Modal
 */
const openAddModal = () => {
  isEditing.value = false
  editingSkill.value = null
  formState.categoryId = ''
  formState.title = ''
  formState.skills = []
  formState.isVisible = true
  skillInput.value = ''
  showFormModal.value = true
}

/**
 * 打開編輯 Modal
 */
const openEditModal = (skill: any) => {
  isEditing.value = true
  editingSkill.value = skill
  formState.categoryId = skill.categoryId
  formState.title = skill.title
  formState.skills = [...skill.skills]
  formState.isVisible = skill.isVisible
  skillInput.value = ''
  showFormModal.value = true
}

/**
 * 新增技能
 */
const addSkill = () => {
  const skill = skillInput.value.trim()
  if (skill && !formState.skills.includes(skill)) {
    formState.skills.push(skill)
    skillInput.value = ''
  }
}

/**
 * 移除技能
 */
const removeSkill = (index: number) => {
  formState.skills.splice(index, 1)
}

/**
 * 提交表單
 */
const handleSubmit = async () => {
  // 驗證
  if (!formState.categoryId || !formState.title || formState.skills.length === 0) {
    toast.add({
      title: '驗證失敗',
      description: '請填寫所有必填欄位',
      color: 'error'
    })
    return
  }

  isSaving.value = true

  try {
    if (isEditing.value) {
      // 更新
      await api.put(
        `/api/admin/skills/${editingSkill.value._id}`,
        formState,
        {
          showSuccessToast: true,
          successMessage: '技能分類更新成功'
        }
      )
    } else {
      // 新增
      await api.post(
        '/api/admin/skills',
        formState,
        {
          showSuccessToast: true,
          successMessage: '技能分類建立成功'
        }
      )
    }

    showFormModal.value = false
    await loadSkills()
  } catch (error) {
    console.error('儲存技能分類失敗:', error)
  } finally {
    isSaving.value = false
  }
}

/**
 * 切換可見性
 */
const toggleVisibility = async (skill: any) => {
  isTogglingVisibility[skill._id] = true

  try {
    await api.put(
      `/api/admin/skills/${skill._id}`,
      {
        ...skill,
        isVisible: skill.isVisible
      },
      {
        showSuccessToast: true,
        successMessage: skill.isVisible ? '已設為顯示' : '已設為隱藏'
      }
    )
  } catch (error) {
    // 恢復原狀態
    skill.isVisible = !skill.isVisible
  } finally {
    isTogglingVisibility[skill._id] = false
  }
}

/**
 * 向上移動
 */
const moveUp = async (index: number) => {
  if (index === 0) return

  const current = skills.value[index]
  const previous = skills.value[index - 1]

  // 交換順序
  const tempOrder = current.order
  current.order = previous.order
  previous.order = tempOrder

  // 重新排序陣列
  skills.value.splice(index, 1)
  skills.value.splice(index - 1, 0, current)

  // 儲存到後端
  await saveOrder()
}

/**
 * 向下移動
 */
const moveDown = async (index: number) => {
  if (index === skills.value.length - 1) return

  const current = skills.value[index]
  const next = skills.value[index + 1]

  // 交換順序
  const tempOrder = current.order
  current.order = next.order
  next.order = tempOrder

  // 重新排序陣列
  skills.value.splice(index, 1)
  skills.value.splice(index + 1, 0, current)

  // 儲存到後端
  await saveOrder()
}

/**
 * 儲存排序
 */
const saveOrder = async () => {
  isReordering.value = true

  try {
    const orders = skills.value.map((skill, index) => ({
      id: skill._id,
      order: index
    }))

    await api.post(
      '/api/admin/skills/reorder',
      { orders },
      {
        showSuccessToast: true,
        successMessage: '排序已更新'
      }
    )
  } catch (error) {
    console.error('更新排序失敗:', error)
    await loadSkills() // 重新載入
  } finally {
    isReordering.value = false
  }
}

/**
 * 確認刪除
 */
const confirmDelete = (skill: any) => {
  skillToDelete.value = skill
  showDeleteModal.value = true
}

/**
 * 刪除技能分類
 */
const deleteSkill = async () => {
  if (!skillToDelete.value) return

  const skillId = skillToDelete.value._id
  isDeletingSkill[skillId] = true

  try {
    await api.delete(
      `/api/admin/skills/${skillId}`,
      {
        showSuccessToast: true,
        successMessage: '技能分類已刪除'
      }
    )

    skills.value = skills.value.filter(s => s._id !== skillId)
    showDeleteModal.value = false
    skillToDelete.value = null
  } catch (error) {
    console.error('刪除技能分類失敗:', error)
  } finally {
    isDeletingSkill[skillId] = false
  }
}

// 初始載入
onMounted(() => {
  loadSkills()
})
</script>

<template>
  <AdminLayout page-title="技能管理" page-description="管理技能分類和排序">
    <div class="skills-container">
      <!-- Header Actions -->
      <div class="header-actions">
        <button
          v-if="hasPermission('skills:write')"
          class="add-button"
          @click="openAddModal"
        >
          <UIcon name="i-heroicons-plus" />
          新增技能分類
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <UIcon name="i-heroicons-arrow-path" class="loading-icon" />
        <p>載入中...</p>
      </div>

      <!-- Skills List -->
      <div v-else-if="skills.length > 0" class="skills-grid">
        <div
          v-for="(skill, index) in skills"
          :key="skill._id"
          class="skill-card"
        >
          <!-- Order Controls -->
          <div class="order-controls">
            <button
              class="order-btn"
              :disabled="index === 0 || isReordering"
              @click="moveUp(index)"
            >
              <UIcon name="i-heroicons-chevron-up" />
            </button>
            <div class="order-number">
              <span>{{ index + 1 }}</span>
            </div>
            <button
              class="order-btn"
              :disabled="index === skills.length - 1 || isReordering"
              @click="moveDown(index)"
            >
              <UIcon name="i-heroicons-chevron-down" />
            </button>
          </div>

          <!-- Content -->
          <div class="skill-content">
            <!-- Header -->
            <div class="skill-header">
              <div class="skill-info">
                <div class="skill-title-row">
                  <h3 class="skill-title">{{ skill.title }}</h3>
                  <span :class="['status-badge', skill.isVisible ? 'visible' : 'hidden']">
                    {{ skill.isVisible ? '顯示' : '隱藏' }}
                  </span>
                </div>
                <p class="skill-id">{{ skill.categoryId }}</p>
              </div>

              <!-- Actions -->
              <div class="skill-actions">
                <label class="switch">
                  <input
                    type="checkbox"
                    v-model="skill.isVisible"
                    :disabled="isTogglingVisibility[skill._id]"
                    @change="toggleVisibility(skill)"
                  />
                  <span class="slider"></span>
                </label>
                <button class="action-btn edit" @click="openEditModal(skill)">
                  <UIcon name="i-heroicons-pencil" />
                </button>
                <button
                  v-if="hasPermission('skills:delete')"
                  class="action-btn delete"
                  :disabled="isDeletingSkill[skill._id]"
                  @click="confirmDelete(skill)"
                >
                  <UIcon name="i-heroicons-trash" />
                </button>
              </div>
            </div>

            <!-- Skills Tags -->
            <div class="skills-tags">
              <span
                v-for="(item, i) in skill.skills"
                :key="i"
                class="skill-tag"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <UIcon name="i-heroicons-star" />
        </div>
        <h3 class="empty-title">尚未建立任何技能分類</h3>
        <p class="empty-description">開始建立你的技能分類</p>
        <button
          v-if="hasPermission('skills:write')"
          class="add-button"
          @click="openAddModal"
        >
          <UIcon name="i-heroicons-plus" />
          新增第一個技能分類
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showFormModal" class="modal-overlay" @click.self="showFormModal = false">
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h3>{{ isEditing ? '編輯技能分類' : '新增技能分類' }}</h3>
        </div>

        <div class="modal-body">
          <!-- Category ID -->
          <div class="form-group">
            <label class="form-label">
              Category ID <span class="required">*</span>
            </label>
            <input
              v-model="formState.categoryId"
              type="text"
              class="form-input"
              placeholder="design-expertise"
              :disabled="isSaving || isEditing"
            />
            <p class="form-help">唯一識別碼,建立後無法修改</p>
          </div>

          <!-- Title -->
          <div class="form-group">
            <label class="form-label">
              分類標題 <span class="required">*</span>
            </label>
            <input
              v-model="formState.title"
              type="text"
              class="form-input"
              placeholder="設計專長"
              :disabled="isSaving"
            />
          </div>

          <!-- Skills -->
          <div class="form-group">
            <label class="form-label">
              技能列表 <span class="required">*</span>
            </label>
            <div class="skills-input-group">
              <!-- Skills Display -->
              <div v-if="formState.skills.length > 0" class="skills-display">
                <div
                  v-for="(skill, index) in formState.skills"
                  :key="index"
                  class="skill-badge"
                >
                  <span>{{ skill }}</span>
                  <button
                    type="button"
                    @click="removeSkill(index)"
                    :disabled="isSaving"
                    class="remove-btn"
                  >
                    <UIcon name="i-heroicons-x-mark" />
                  </button>
                </div>
              </div>
              <!-- Input -->
              <div class="input-with-icon">
                <UIcon name="i-heroicons-plus-circle" class="input-icon" />
                <input
                  v-model="skillInput"
                  type="text"
                  class="form-input"
                  placeholder="輸入技能後按 Enter 新增"
                  @keydown.enter.prevent="addSkill"
                  :disabled="isSaving"
                />
              </div>
              <p class="form-help">按 Enter 鍵新增技能</p>
            </div>
          </div>

          <!-- Visibility -->
          <div class="form-group">
            <label class="form-label">顯示狀態</label>
            <div class="visibility-toggle">
              <label class="switch">
                <input type="checkbox" v-model="formState.isVisible" :disabled="isSaving" />
                <span class="slider"></span>
              </label>
              <span class="visibility-text">
                {{ formState.isVisible ? '在前台顯示' : '在前台隱藏' }}
              </span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="cancel-button"
            @click="showFormModal = false"
            :disabled="isSaving"
          >
            取消
          </button>
          <button
            class="submit-button"
            @click="handleSubmit"
            :disabled="isSaving"
          >
            {{ isSaving ? '儲存中...' : (isEditing ? '儲存變更' : '建立分類') }}
          </button>
        </div>
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
            確定要刪除技能分類「<strong>{{ skillToDelete?.title }}</strong>」嗎?
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
            :disabled="isDeletingSkill[skillToDelete?._id]"
            @click="deleteSkill"
          >
            {{ isDeletingSkill[skillToDelete?._id] ? '刪除中...' : '確認刪除' }}
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.skills-container {
  max-width: 100%;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 24px;
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

/* Skills Grid */
.skills-grid {
  display: grid;
  gap: 16px;
}

.skill-card {
  display: flex;
  gap: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
  transition: all 0.3s ease;
}

.skill-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Order Controls */
.order-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.order-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.order-btn:hover:not(:disabled) {
  background: #f1f5f9;
  color: #3b82f6;
  border-color: #3b82f6;
}

.order-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.order-number {
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

/* Skill Content */
.skill-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.skill-info {
  flex: 1;
  min-width: 0;
}

.skill-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.skill-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.visible {
  background: #dcfce7;
  color: #166534;
}

.status-badge.hidden {
  background: #f1f5f9;
  color: #64748b;
}

.skill-id {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Skill Actions */
.skill-actions {
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

/* Skills Tags */
.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  padding: 6px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

/* Switch Toggle */
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

.modal-large {
  max-width: 700px;
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

.form-input {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  color: #0f172a;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-help {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 20px;
  pointer-events: none;
}

.input-with-icon .form-input {
  padding-left: 48px;
}

.skills-input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skills-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.skill-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #1e40af;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.remove-btn:hover:not(:disabled) {
  color: #dc2626;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.visibility-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.visibility-text {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}

/* Modal Buttons */
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

.cancel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
@media (max-width: 768px) {
  .skill-card {
    flex-direction: column;
  }

  .order-controls {
    flex-direction: row;
  }

  .skill-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .skill-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
