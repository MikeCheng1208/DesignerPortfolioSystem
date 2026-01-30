<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'
import type {
  Profile,
  ProjectCard,
  SkillCategory,
  ContactInfo,
  SiteSettings
} from '~/types/api'
import type { ThemeConfig } from '~/types/database'
import { DEFAULT_THEMES } from '~/types/database'

// 動態載入主題組件
const ClassicTheme = defineAsyncComponent(() => import('~/components/front/themes/ClassicTheme.vue'))
const MinimalTheme = defineAsyncComponent(() => import('~/components/front/themes/MinimalTheme.vue'))
const CreativeTheme = defineAsyncComponent(() => import('~/components/front/themes/CreativeTheme.vue'))
const JapaneseTheme = defineAsyncComponent(() => import('~/components/front/themes/JapaneseTheme.vue'))
const TechTheme = defineAsyncComponent(() => import('~/components/front/themes/TechTheme.vue'))
const BrutalTheme = defineAsyncComponent(() => import('~/components/front/themes/BrutalTheme.vue'))

// 從 app.vue 注入網站設定
const siteSettings = inject<Ref<SiteSettings | null>>('siteSettings')

// 使用 useFetch 從 API 獲取資料
const { data: profile } = await useFetch<Profile>('/api/profile')
const { data: projects } = await useFetch<ProjectCard[]>('/api/projects')
const { data: skills } = await useFetch<SkillCategory[]>('/api/skills')
const { data: contact } = await useFetch<ContactInfo>('/api/contact')

// 取得當前主題
const currentTheme = computed<ThemeConfig>(() => {
  return siteSettings?.value?.theme || DEFAULT_THEMES[0]
})

// 根據主題 ID 取得對應組件
const themeComponent = computed(() => {
  switch (currentTheme.value.id) {
    case 'classic':
      return ClassicTheme
    case 'minimal':
      return MinimalTheme
    case 'creative':
      return CreativeTheme
    case 'japanese':
      return JapaneseTheme
    case 'tech':
      return TechTheme
    case 'brutal':
      return BrutalTheme
    default:
      return ClassicTheme
  }
})

// Hero 相關內容
const heroTitle = computed(() =>
  profile.value?.heroTitle || '創造有意義的\n數位體驗'
)
const heroSubtitle = computed(() =>
  profile.value?.heroSubtitle ||
  '專注於使用者體驗設計與介面創新，\n透過設計解決問題，創造價值'
)
const siteName = computed(() => profile.value?.name || siteSettings?.value?.siteName || 'No Name')
</script>

<template>
  <component
    :is="themeComponent"
    :profile="profile"
    :projects="projects"
    :skills="skills"
    :contact="contact"
    :site-name="siteName"
    :hero-title="heroTitle"
    :hero-subtitle="heroSubtitle"
  />
</template>
