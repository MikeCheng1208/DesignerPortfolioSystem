<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useAdminAuth } from '~/composables/admin/useAdminAuth'
import { useAdminAPI } from '~/composables/admin/useAdminAPI'
import AdminLayout from '~/components/admin/AdminLayout.vue'

definePageMeta({
  middleware: 'admin-auth'
})

const { hasPermission } = useAdminAuth()
const toast = useToast()
const api = useAdminAPI()
const router = useRouter()

// 檢查權限
if (!hasPermission('projects:write')) {
  navigateTo('/admin/dashboard')
}

// 狀態管理
const isSaving = ref(false)
const tagInput = ref('')

// 表單狀態
const formState = reactive({
  projectId: '',
  title: '',
  category: '',
  year: new Date().getFullYear().toString(),
  description: '',
  tags: [] as string[],
  color: '',
  coverGradient: '',
  overview: '',
  client: '',
  duration: '',
  role: '',
  tools: '',
  challenge: '',
  solution: '',
  images: [] as any[],
  results: [] as any[],
  published: false,
  featured: false,
  order: 0,
  slug: '',
  metaDescription: '',
  metaKeywords: [] as string[]
})

/**
 * 新增標籤
 */
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !formState.tags.includes(tag)) {
    formState.tags.push(tag)
    tagInput.value = ''
  }
}

/**
 * 移除標籤
 */
const removeTag = (index: number) => {
  formState.tags.splice(index, 1)
}

/**
 * 提交表單
 */
const handleSubmit = async () => {
  // 驗證必填欄位
  const requiredFields = {
    projectId: 'Project ID',
    title: '作品標題',
    category: '分類',
    year: '年份',
    description: '簡短描述',
    color: '卡片顏色',
    coverGradient: '封面漸層',
    overview: '專案概述',
    client: '客戶',
    duration: '時程',
    role: '角色',
    tools: '使用工具',
    challenge: '挑戰',
    solution: '解決方案',
    slug: 'URL Slug'
  }

  for (const [field, label] of Object.entries(requiredFields)) {
    if (!formState[field as keyof typeof formState]) {
      toast.add({
        title: '驗證失敗',
        description: `請填寫「${label}」`,
        color: 'red'
      })
      return
    }
  }

  isSaving.value = true

  try {
    const response = await api.post(
      '/api/admin/projects',
      formState,
      {
        showSuccessToast: true,
        successMessage: '作品建立成功'
      }
    )

    // 導向編輯頁面
    router.push(`/admin/projects/${response.project._id}`)
  } catch (error) {
    console.error('建立作品失敗:', error)
  } finally {
    isSaving.value = false
  }
}

// 自動同步 projectId 到 slug
watch(() => formState.projectId, (newValue) => {
  if (!formState.slug) {
    formState.slug = newValue
  }
})
</script>

<template>
  <AdminLayout page-title="新增作品" page-description="建立新的作品集項目">
    <UCard>
      <UForm :state="formState" @submit="handleSubmit" class="space-y-8">
        <!-- 基本資訊 -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-900 border-b pb-2">基本資訊</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Project ID -->
            <UFormField label="Project ID" name="projectId" required help="URL 友善的唯一識別碼,例如:fintech-app">
              <UInput
                v-model="formState.projectId"
                placeholder="fintech-app"
                :disabled="isSaving"
              />
            </UFormField>

            <!-- Slug -->
            <UFormField label="URL Slug" name="slug" required help="用於 SEO 的網址路徑">
              <UInput
                v-model="formState.slug"
                placeholder="fintech-app"
                :disabled="isSaving"
              />
            </UFormField>
          </div>

          <!-- Title -->
          <UFormField label="作品標題" name="title" required>
            <UInput
              v-model="formState.title"
              placeholder="請輸入作品標題"
              size="lg"
              :disabled="isSaving"
            />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Category -->
            <UFormField label="分類" name="category" required>
              <UInput
                v-model="formState.category"
                placeholder="例如:UI/UX Design"
                :disabled="isSaving"
              />
            </UFormField>

            <!-- Year -->
            <UFormField label="年份" name="year" required>
              <UInput
                v-model="formState.year"
                placeholder="2024"
                :disabled="isSaving"
              />
            </UFormField>
          </div>

          <!-- Description -->
          <UFormField label="簡短描述" name="description" required>
            <UTextarea
              v-model="formState.description"
              placeholder="請輸入作品的簡短描述"
              :rows="3"
              :disabled="isSaving"
            />
          </UFormField>

          <!-- Tags -->
          <UFormField label="標籤" name="tags" help="按 Enter 新增標籤">
            <div class="space-y-2">
              <div class="flex flex-wrap gap-2">
                <UBadge
                  v-for="(tag, index) in formState.tags"
                  :key="index"
                  color="blue"
                  variant="soft"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(index)"
                    class="ml-1 hover:text-red-500"
                  >
                    ×
                  </button>
                </UBadge>
              </div>
              <UInput
                v-model="tagInput"
                placeholder="輸入標籤後按 Enter"
                @keydown.enter.prevent="addTag"
                :disabled="isSaving"
              />
            </div>
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Color -->
            <UFormField label="卡片顏色" name="color" required help="卡片漸層色">
              <UInput
                v-model="formState.color"
                placeholder="#667EEA"
                :disabled="isSaving"
              />
            </UFormField>

            <!-- Cover Gradient -->
            <UFormField label="封面漸層" name="coverGradient" required>
              <UInput
                v-model="formState.coverGradient"
                placeholder="from-blue-500 to-purple-600"
                :disabled="isSaving"
              />
            </UFormField>
          </div>
        </div>

        <USeparator />

        <!-- 專案詳情 -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-900 border-b pb-2">專案詳情</h3>

          <!-- Overview -->
          <UFormField label="專案概述" name="overview" required>
            <UTextarea
              v-model="formState.overview"
              placeholder="請輸入專案概述"
              :rows="4"
              :disabled="isSaving"
            />
          </UFormField>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Client -->
            <UFormField label="客戶" name="client" required>
              <UInput
                v-model="formState.client"
                placeholder="客戶名稱"
                :disabled="isSaving"
              />
            </UFormField>

            <!-- Duration -->
            <UFormField label="時程" name="duration" required>
              <UInput
                v-model="formState.duration"
                placeholder="3 個月"
                :disabled="isSaving"
              />
            </UFormField>

            <!-- Role -->
            <UFormField label="角色" name="role" required>
              <UInput
                v-model="formState.role"
                placeholder="UI/UX Designer"
                :disabled="isSaving"
              />
            </UFormField>
          </div>

          <!-- Tools -->
          <UFormField label="使用工具" name="tools" required>
            <UInput
              v-model="formState.tools"
              placeholder="Figma, Sketch, Adobe XD"
              :disabled="isSaving"
            />
          </UFormField>

          <!-- Challenge -->
          <UFormField label="挑戰" name="challenge" required>
            <UTextarea
              v-model="formState.challenge"
              placeholder="請描述專案面臨的挑戰"
              :rows="4"
              :disabled="isSaving"
            />
          </UFormField>

          <!-- Solution -->
          <UFormField label="解決方案" name="solution" required>
            <UTextarea
              v-model="formState.solution"
              placeholder="請描述如何解決挑戰"
              :rows="4"
              :disabled="isSaving"
            />
          </UFormField>
        </div>

        <USeparator />

        <!-- 狀態設定 -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-slate-900 border-b pb-2">發布設定</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Published -->
            <UFormField label="發布狀態" name="published">
              <div class="flex items-center gap-2">
                <USwitch v-model="formState.published" :disabled="isSaving" />
                <span class="text-sm">{{ formState.published ? '已發布' : '草稿' }}</span>
              </div>
            </UFormField>

            <!-- Featured -->
            <UFormField label="精選作品" name="featured">
              <div class="flex items-center gap-2">
                <USwitch v-model="formState.featured" :disabled="isSaving" />
                <span class="text-sm">{{ formState.featured ? '是' : '否' }}</span>
              </div>
            </UFormField>

            <!-- Order -->
            <UFormField label="排序" name="order" help="數字越小越前面">
              <UInput
                v-model.number="formState.order"
                type="number"
                :disabled="isSaving"
              />
            </UFormField>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between pt-4 border-t">
          <UButton
            color="gray"
            variant="ghost"
            to="/admin/projects"
          >
            取消
          </UButton>

          <UButton
            type="submit"
            color="primary"
            :loading="isSaving"
            :disabled="isSaving"
          >
            建立作品
          </UButton>
        </div>
      </UForm>
    </UCard>
  </AdminLayout>
</template>
