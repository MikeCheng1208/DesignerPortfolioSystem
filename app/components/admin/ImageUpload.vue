<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue?: string
  alt?: string
  placeholder?: string
  help?: string
  width?: number
  height?: number
  previewClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  alt: '圖片預覽',
  placeholder: '點擊上傳圖片',
  help: '',
  width: 800,
  height: 600,
  previewClass: 'max-h-64'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const toast = useToast()
const isUploading = ref(false)

/**
 * 模擬上傳圖片
 * 使用 Unsplash 隨機圖片作為假資料
 */
const handleUpload = async () => {
  isUploading.value = true

  // 模擬上傳延遲
  await new Promise(resolve => setTimeout(resolve, 1000))

  try {
    // 使用 Unsplash 隨機圖片(指定尺寸)
    const randomId = Math.random().toString(36).substring(7)
    const fakeImageUrl = `https://images.unsplash.com/photo-${Date.now() % 1000000000000}?w=${props.width}&h=${props.height}&fit=crop&q=80&sig=${randomId}`

    // 或者使用 Picsum(更穩定)
    const picsumUrl = `https://picsum.photos/${props.width}/${props.height}?random=${Date.now()}`

    emit('update:modelValue', picsumUrl)

    toast.add({
      title: '上傳成功',
      description: '圖片已上傳(假資料)',
      color: 'green',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    toast.add({
      title: '上傳失敗',
      description: '圖片上傳時發生錯誤',
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    isUploading.value = false
  }
}

/**
 * 移除圖片
 */
const handleRemove = () => {
  emit('update:modelValue', '')

  toast.add({
    title: '已移除',
    description: '圖片已移除',
    color: 'gray',
    icon: 'i-heroicons-trash'
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Upload Button -->
    <div class="flex items-center gap-2">
      <UButton
        icon="i-heroicons-photo"
        color="primary"
        variant="soft"
        @click="handleUpload"
        :loading="isUploading"
      >
        {{ modelValue ? '更換圖片' : '上傳圖片' }}
      </UButton>

      <UButton
        v-if="modelValue"
        icon="i-heroicons-trash"
        color="red"
        variant="ghost"
        @click="handleRemove"
      >
        移除
      </UButton>
    </div>

    <!-- Preview -->
    <div v-if="modelValue" class="relative border-2 border-slate-200 rounded-lg overflow-hidden">
      <img
        :src="modelValue"
        :alt="alt"
        class="w-full h-auto object-cover"
        :class="previewClass"
      />
      <div class="absolute top-2 right-2">
        <UBadge color="blue" variant="solid">
          假資料
        </UBadge>
      </div>
    </div>

    <!-- Placeholder -->
    <div
      v-else
      class="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50"
    >
      <UIcon name="i-heroicons-photo" class="w-12 h-12 text-slate-400 mx-auto mb-2" />
      <p class="text-sm text-slate-600">{{ placeholder }}</p>
      <p class="text-xs text-slate-500 mt-1">目前使用假資料(Unsplash 隨機圖片)</p>
    </div>

    <!-- Help Text -->
    <p v-if="help" class="text-sm text-slate-500">{{ help }}</p>
  </div>
</template>
